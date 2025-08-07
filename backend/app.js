// ...existing code...
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const app = express();
const { Experto } = require("./models/models");
const Usuario = require("./models/usuario");

// Middleware global para pasar esExperto a todas las vistas
app.use(async (req, res, next) => {
  res.locals.esExperto = false;
  if (req.session && req.session.usuarioId) {
    try {
      const usuario = await Usuario.findById(req.session.usuarioId);
      if (usuario && usuario.es_experto) {
        res.locals.esExperto = true;
      }
    } catch (e) {}
  }
  next();
});

// Habilita CORS para los frontends permitidos
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir cualquier origen local en desarrollo
      if (!origin || origin.startsWith("http://localhost")) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
  })
);

// Configura sesiones de usuario
app.use(
  session({
    secret: process.env.SESSION_SECRET || "servitech_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true solo en producción con HTTPS
      httpOnly: true,
      sameSite: "lax", // "lax" es seguro para desarrollo local
      path: "/", // Asegura que la cookie se envía a todas las rutas
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    },
  })
);

app.use(express.json());

// Middleware global para pasar esExperto a todas las vistas
app.use(async (req, res, next) => {
  res.locals.esExperto = false;
  if (req.session && req.session.usuarioId) {
    try {
      const usuario = await Usuario.findById(req.session.usuarioId);
      if (usuario && usuario.es_experto) {
        res.locals.esExperto = true;
      }
    } catch (e) {}
  }
  next();
});

// Conexión a MongoDB

// Conexión local por defecto. Si quieres volver a la nube, descomenta el bloque de arriba y comenta este.
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/servitech";
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB:", MONGODB_URI);
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err);
    process.exit(1);
  });

// Servir archivos estáticos y configurar motor de vistas
app.use(express.static(path.join(__dirname, "../views")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use("/assets", express.static(path.join(__dirname, "../views/assets")));

// Usar express-formidable para parsear formularios con campos anidados
const formidable = require("express-formidable");

// Ruta para perfil de experto (debe ir después de la configuración de vistas)
app.get("/perfil-experto", async (req, res) => {
  if (!req.session || !req.session.usuarioId) {
    return res.redirect("/login");
  }
  try {
    const usuario = await Usuario.findById(req.session.usuarioId);
    if (!usuario || !usuario.es_experto) {
      return res.redirect("/registro-experto");
    }
    // Log de depuración para ver los datos que llegan a la vista
    console.log(
      "[DEBUG] Datos de usuario enviados a perfil-experto:",
      JSON.stringify(usuario, null, 2)
    );
    res.render("perfil-experto", { usuario });
  } catch (err) {
    res.status(500).send("Error al cargar el perfil de experto");
  }
});

// Rutas principales
const userRoutes = require("./routes/usuarios");
const categoriasRoutes = require("./routes/categorias");
const expertosRoutes = require("./routes/expertos");
const registroExpertoRoutes = require("./routes/registro-experto");
const especialidadesRoutes = require("./routes/especialidades");

// Solo para rutas de usuario, permitir JSON y urlencoded
app.use("/api/usuarios", express.json());
app.use("/api/usuarios", express.urlencoded({ extended: true }));
app.use("/api/usuarios", userRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/expertos", expertosRoutes);
app.use("/api/especialidades", especialidadesRoutes);
// Usar formidable solo para registro-experto
app.use("/registro-experto", formidable());
app.use("/registro-experto", registroExpertoRoutes);
app.use("/api/skills", require("./routes/skills"));

// Rutas para vistas EJS
app.get("/", (req, res) => res.render("index"));
app.get("/expertos.html", async (req, res) => {
  try {
    const expertos = await Experto.find().populate("userId");
    res.render("expertos", { expertos });
  } catch (err) {
    res.render("expertos", { expertos: [] });
  }
});

app.get("/registro.html", (req, res) => res.render("registro"));
app.get("/registro-experto.html", async (req, res) => {
  let email = "";
  if (req.session && req.session.usuarioId) {
    try {
      const usuario = await Usuario.findById(req.session.usuarioId);
      if (usuario) email = usuario.email;
    } catch (e) {}
  }
  res.render("registro-experto", { email });
});
app.get("/login", (req, res) => res.render("login"));
app.get("/login.html", (req, res) => res.render("login"));
app.get("/recuperar-password.html", (req, res) =>
  res.render("recuperar-password")
);
app.get("/calendario.html", (req, res) =>
  res.render("calendario", {
    pageTitle: "Calendario - Agendar Cita",
    expertoSeleccionado: null,
  })
);

app.get("/perfil.html", (req, res) => res.render("perfil"));
app.get("/terminos.html", (req, res) => res.render("terminos"));
app.get("/privacidad.html", (req, res) => res.render("privacidad"));
app.get("/contacto.html", (req, res) => res.render("contacto"));
app.get("/confirmacion-asesoria.html", (req, res) =>
  res.render("confirmacion-asesoria")
);
app.get("/pasarela-pagos.html", (req, res) =>
  res.render("pasarela-pagos", {
    pageTitle: "Pasarela de Pago - Servitech",
    expertoSeleccionado: null,
  })
);

app.get("/mis-asesorias.html", (req, res) => {
  const usuarioId = req.session?.usuarioId || "64f1e2c1234567890abcdef1";
  const rolUsuario = req.session?.rolUsuario || "cliente";
  res.render("mis-asesorias", { usuarioId, rolUsuario });
});
app.get("/mensajes.html", (req, res) => res.render("mensajes"));

// Ruta para editar perfil de experto
app.get("/editar-perfil-experto", async (req, res) => {
  if (!req.session || !req.session.usuarioId) {
    return res.redirect("/login");
  }
  try {
    const usuario = await Usuario.findById(req.session.usuarioId);
    if (!usuario || !usuario.es_experto) {
      return res.redirect("/perfil-experto");
    }
    res.render("editar-perfil-experto", { usuario });
  } catch (err) {
    res.status(500).send("Error al cargar la edición de perfil de experto");
  }
});

// Guardar cambios de perfil de experto
app.post("/editar-perfil-experto", formidable(), async (req, res) => {
  if (!req.session || !req.session.usuarioId) {
    return res.redirect("/login");
  }
  try {
    console.log("FIELDS editar-perfil-experto:", req.fields);
    const usuario = await Usuario.findById(req.session.usuarioId);
    if (!usuario || !usuario.es_experto) {
      return res.redirect("/perfil-experto");
    }
    // Actualizar campos
    usuario.experto.especialidad = req.fields.especialidad;
    usuario.experto.descripcion = req.fields.descripcion;
    usuario.experto.categorias = req.fields.categorias
      ? req.fields.categorias.split(",").map((c) => ({ nombre: c.trim() }))
      : [];
    usuario.experto.skills = req.fields.skills
      ? req.fields.skills.split(",").map((s) => s.trim())
      : [];
    usuario.experto.horario = {
      dias_disponibles: req.fields.dias_disponibles
        ? req.fields.dias_disponibles.split(",").map((d) => d.trim())
        : [],
      hora_inicio: req.fields.hora_inicio || "",
      hora_fin: req.fields.hora_fin || "",
    };
    usuario.experto.precio = req.fields.precio;
    usuario.experto.datosBancarios = req.fields.datosBancarios;
    await usuario.save();
    res.redirect("/perfil-experto");
  } catch (err) {
    console.error("ERROR editar-perfil-experto:", err);
    res.status(500).send("Error al guardar los cambios de perfil de experto");
  }
});

// Elimina la ruta de perfil de experto si existe
// app.get("/expertos/:id/perfil", ...);

// Ruta POST para registro de experto

// Ruta dinámica: calendario de experto
app.get("/expertos/:id/calendario", async (req, res) => {
  try {
    const experto = await Experto.findById(req.params.id).populate("userId");
    if (!experto) return res.status(404).send("Experto no encontrado");
    res.render("calendario", { expertoSeleccionado: experto });
  } catch (err) {
    res.status(500).send("Error al cargar calendario de experto");
  }
});

// Puerto y arranque del servidor
// Para cambiar el puerto, puedes ejecutar: PORT=3001 node app.js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
  console.log(`Accede a la aplicación en: http://localhost:${PORT}`);
});

module.exports = app;
