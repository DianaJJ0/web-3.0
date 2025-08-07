const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");
const multer = require("multer");
const upload = multer();

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
router.post("/", upload.none(), async (req, res) => {
  console.log("POST /registro-experto session:", req.session);
  const {
    especialidad,
    descripcion,
    categorias,
    precio,
    skills,
    dias_disponibles,
    hora_inicio,
    hora_fin,
    datosBancarios,
  } = req.body;

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
        dias_disponibles: dias_disponibles
          ? dias_disponibles.split(",").map((d) => d.trim())
          : [],
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
