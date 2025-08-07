const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");

// Ruta para mostrar el formulario (si usas EJS, la vista ya existe)
router.get("/", async (req, res) => {
  let email = "";
  if (req.session && req.session.usuarioId) {
    // Busca el email del usuario autenticado
    const usuario = await Usuario.findById(req.session.usuarioId);
    if (usuario) email = usuario.email;
  }
  res.render("registro-experto", { email });
});

// Ruta para procesar el registro de experto
router.post("/", async (req, res) => {
  console.log("POST /registro-experto session:", req.session);
  const {
    especialidad,
    descripcion,
    categorias,
    precio,
    skills,
    datosBancarios,
  } = req.fields;

  // Validar skills tecnológicas
  const palabrasClave = [
    "web",
    "program",
    "desarroll",
    "software",
    "app",
    "cloud",
    "devops",
    "red",
    "sistemas",
    "base de datos",
    "seguridad",
    "soporte",
    "infraestructura",
    "tecnolog",
    "digital",
    "robot",
    "automat",
    "inteligencia",
    "machine",
    "data",
    "blockchain",
    "seo",
    "ux",
    "ui",
    "movil",
    "mobile",
    "backend",
    "frontend",
    "fullstack",
    "ciber",
    "ai",
    "ml",
    "iot",
    "hardware",
    "virtual",
    "realidad",
    "videojuego",
    "gaming",
    "testing",
    "qa",
    "cloud",
    "network",
    "it",
    "comput",
    "electron",
    "ingenier",
    "analitica",
    "analítica",
    "big data",
    "python",
    "java",
    "javascript",
    "typescript",
    "php",
    "c#",
    "c++",
    "go",
    "ruby",
    "swift",
    "kotlin",
    "react",
    "angular",
    "vue",
    "node",
    "express",
    "django",
    "laravel",
    "spring",
    "flutter",
    "ionic",
    "sql",
    "nosql",
    "mongo",
    "firebase",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "linux",
    "windows",
    "mac",
    "raspberry",
    "arduino",
    "cloud",
    "blockchain",
    "fintech",
    "biometr",
    "automatiz",
    "virtualiz",
    "microservicio",
    "microservices",
    "api",
    "rest",
    "graphql",
    "scrum",
    "agile",
    "jira",
    "git",
    "github",
    "bitbucket",
    "ci",
    "cd",
    "pipelines",
    "testing",
    "selenium",
    "cypress",
    "jest",
    "mocha",
    "chai",
    "pytest",
    "robotframework",
    "qa",
    "dev",
    "tecnolog",
  ];
  let skillsArray = skills ? skills.split(",").map((s) => s.trim()) : [];
  const skillsNoTech = skillsArray.filter(
    (skill) =>
      !palabrasClave.some((clave) => skill.toLowerCase().includes(clave))
  );
  if (skillsNoTech.length > 0) {
    return res.status(400).render("registro-experto", {
      error: `Solo se permiten habilidades tecnológicas. No válidas: ${skillsNoTech.join(
        ", "
      )}`,
    });
  }

  // Reconstruir horarios desde campos planos horarios[n][campo]
  let dias_disponibles = [];
  let hora_inicio = "";
  let hora_fin = "";
  const horarios = [];
  // Buscar todos los campos horarios[n][campo]
  Object.keys(req.fields).forEach((key) => {
    const match = key.match(/^horarios\[(\d+)\]\[(dia|inicio|fin)\]$/);
    if (match) {
      const idx = Number(match[1]);
      const campo = match[2];
      if (!horarios[idx]) horarios[idx] = {};
      horarios[idx][campo] = req.fields[key];
    }
  });
  // Filtrar horarios válidos
  const horariosValidos = horarios.filter(
    (h) => h && h.dia && h.inicio && h.fin
  );
  if (horariosValidos.length > 0) {
    dias_disponibles = horariosValidos.map((h) => h.dia);
    // Tomar el rango más amplio (inicio más temprano y fin más tarde)
    const inicios = horariosValidos.map((h) => h.inicio);
    const fines = horariosValidos.map((h) => h.fin);
    hora_inicio = inicios.sort()[0];
    hora_fin = fines.sort().reverse()[0];
  } else {
    // Compatibilidad con formularios antiguos
    dias_disponibles = req.fields.dias_disponibles
      ? req.fields.dias_disponibles.split(",").map((d) => d.trim())
      : [];
    hora_inicio = req.fields.hora_inicio || "";
    hora_fin = req.fields.hora_fin || "";
  }

  // Solo permitir si el usuario está logeado (sesión activa)
  if (!req.session || !req.session.usuarioId) {
    return res.status(401).render("registro-experto", {
      error: "Debes iniciar sesión como usuario para registrarte como experto.",
    });
  }

  try {
    // Buscar usuario autenticado por ID de sesión
    const usuario = await Usuario.findById(req.session.usuarioId);
    if (!usuario) {
      return res.status(400).render("registro-experto", {
        error: "Usuario no encontrado.",
      });
    }
    if (usuario.es_experto) {
      // Si ya es experto, redirige directamente al perfil de experto
      return res.redirect("/perfil-experto");
    }

    // Actualizar datos de experto
    usuario.es_experto = true;
    usuario.experto = {
      especialidad,
      descripcion,
      categorias: categorias
        ? categorias.split(",").map((cat) => ({ nombre: cat.trim() }))
        : [],
      precio,
      skills: skills ? skills.split(",").map((s) => s.trim()) : [],
      activo: true,
      calificacion: { promedio: 0, total_reviews: 0 },
      horario: {
        dias_disponibles,
        hora_inicio,
        hora_fin,
      },
      fechaRegistro: new Date(),
      datosBancarios,
    };
    await usuario.save();
    res.render("registro-experto", {
      success: "¡Solicitud enviada! Tu perfil será revisado.",
      email: usuario.email,
    });
  } catch (err) {
    res.status(500).render("registro-experto", {
      error: "Error al registrar como experto.",
    });
  }
});

module.exports = router;
