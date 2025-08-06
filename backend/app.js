// Configuración principal de la app ServiTech
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const app = express();
const { Experto } = require("./models/models");

// Habilita CORS para los frontends permitidos
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
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
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(express.json());

// Conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
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

// Rutas principales
const userRoutes = require("./routes/usuarios");
const categoriasRoutes = require("./routes/categorias");
const expertosRoutes = require("./routes/expertos");
app.use("/api/usuarios", userRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/expertos", expertosRoutes);

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

// Elimina la ruta de perfil de experto si existe
// app.get("/expertos/:id/perfil", ...);

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor backend escuchando en puerto ${PORT}`);
  console.log(` Accede a la aplicación en: http://localhost:${PORT}`);
});

module.exports = app;
module.exports = app;
