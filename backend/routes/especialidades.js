const express = require("express");
const router = express.Router();
const Especialidad = require("../models/especialidad");

// Listar especialidades
router.get("/", async (req, res) => {
  try {
    const especialidades = await Especialidad.find();
    res.json(especialidades);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener especialidades." });
  }
});

// Crear especialidad (opcional, para pruebas)
router.post("/crear", async (req, res) => {
  const { nombre, descripcion } = req.body;
  // Palabras clave tecnológicas permitidas (puedes ampliar esta lista)
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
  const nombreLower = (nombre || "").toLowerCase();
  const esTecnologica = palabrasClave.some((clave) =>
    nombreLower.includes(clave)
  );
  if (!esTecnologica) {
    return res
      .status(400)
      .json({
        error: "Solo se permiten especialidades tecnológicas o afines.",
      });
  }
  try {
    const existe = await Especialidad.findOne({ nombre });
    if (existe)
      return res.status(400).json({ error: "La especialidad ya existe." });
    const nueva = new Especialidad({ nombre, descripcion });
    await nueva.save();
    res.status(201).json({ mensaje: "Especialidad creada correctamente." });
  } catch (err) {
    res.status(500).json({ error: "Error al crear especialidad." });
  }
});

module.exports = router;
