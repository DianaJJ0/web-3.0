const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Experto = require("../models/expertos");
const { Usuario } = require("../models/models");

// GET /api/expertos - Listar todos
router.get("/", async (req, res) => {
  try {
    const expertos = await Experto.find().populate("userId");
    res.json(expertos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/expertos/:id/calendario - Render calendario de experto
router.get("/:id/calendario", async (req, res) => {
  try {
    let experto;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      experto = {
        _id: new mongoose.Types.ObjectId(),
        userId: {
          nombre: "María",
          apellido: "Rodríguez",
          email: "maria.rodriguez@example.com",
          telefono: "+57 300 123 4567",
          foto: "/assets/img/default-avatar.png",
        },
        especialidad: "Desarrollo Web",
        descripcion: "Especialista en desarrollo web full-stack con 10 años de experiencia",
        activo: true,
        categorias: [],
      };
    } else {
      experto = await Experto.findById(req.params.id)
        .populate("userId")
        .populate("categorias");
      if (!experto) {
        experto = {
          _id: req.params.id,
          userId: {
            nombre: "María",
            apellido: "Rodríguez",
            email: "maria.rodriguez@example.com",
            telefono: "+57 300 123 4567",
            foto: "/assets/img/default-avatar.png",
          },
          especialidad: "Desarrollo Web",
          descripcion: "Especialista en desarrollo web full-stack con 10 años de experiencia",
          activo: true,
          categorias: [],
        };
      }
    }
    
  } catch (err) {
    res.status(500).send(`
      <div style="text-align: center; padding: 50px;">
        <h1> Error interno del servidor</h1>
        <p>Ocurrió un error al cargar la información del experto.</p>
        <a href="/expertos.html">← Volver a la lista de expertos</a>
      </div>
    `);
  }
});

// GET /api/expertos/:id - Obtener por ID
router.get("/:id", async (req, res) => {
  try {
    const experto = await Experto.findById(req.params.id)
      .populate("userId")
      .populate("categorias");
    if (!experto) return res.status(404).json({ message: "Experto no encontrado" });
    res.json(experto);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/expertos - Crear
router.post("/", async (req, res) => {
  try {
    if (!req.body.userId || !req.body.especialidad) {
      return res.status(400).json({ message: "userId y especialidad son requeridos" });
    }
    const usuario = await Usuario.findById(req.body.userId);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    const yaExperto = await Experto.findOne({ userId: req.body.userId });
    if (yaExperto) return res.status(400).json({ message: "El usuario ya es un experto" });
    const experto = new Experto({
      userId: req.body.userId,
      especialidad: req.body.especialidad,
      descripcion: req.body.descripcion,
    });
    const nuevoExperto = await experto.save();
    res.status(201).json(nuevoExperto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/expertos/categoria/:categoriaId - Por categoría
router.get("/categoria/:categoriaId", async (req, res) => {
  try {
    const expertos = await Experto.find({
      categorias: req.params.categoriaId,
      activo: true,
    })
      .populate("userId")
      .populate("categorias");
    res.json(expertos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/expertos/:id - Actualizar
router.put("/:id", async (req, res) => {
  try {
    const experto = await Experto.findById(req.params.id);
    if (!experto) return res.status(404).json({ message: "Experto no encontrado" });
    if (req.body.especialidad) experto.especialidad = req.body.especialidad;
    if (req.body.descripcion) experto.descripcion = req.body.descripcion;
    if (req.body.categorias) experto.categorias = req.body.categorias;
    if (typeof req.body.activo === "boolean") experto.activo = req.body.activo;
    await experto.save();
    res.json(experto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/expertos/:id - Eliminar
router.delete("/:id", async (req, res) => {
  try {
    const experto = await Experto.findByIdAndDelete(req.params.id);
    if (!experto) return res.status(404).json({ message: "Experto no encontrado" });
    res.json({ message: "Experto eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/expertos/:id/pasarela-pagos - Render pasarela pagos
router.get("/:id/pasarela-pagos", async (req, res) => {
  try {
    let experto;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      experto = {
        _id: new mongoose.Types.ObjectId(),
        userId: {
          nombre: "María",
          apellido: "Rodríguez",
          email: "maria.rodriguez@example.com",
          telefono: "+57 300 123 4567",
          foto: "/assets/img/default-avatar.png",
        },
        especialidad: "Desarrollo Web",
        descripcion: "Especialista en desarrollo web full-stack con 10 años de experiencia",
        activo: true,
        categorias: [],
      };
    } else {
      experto = await Experto.findById(req.params.id)
        .populate("userId")
        .populate("categorias");
      if (!experto) {
        experto = {
          _id: req.params.id,
          userId: {
            nombre: "María",
            apellido: "Rodríguez",
            email: "maria.rodriguez@example.com",
            telefono: "+57 300 123 4567",
            foto: "/assets/img/default-avatar.png",
          },
          especialidad: "Desarrollo Web",
          descripcion: "Especialista en desarrollo web full-stack con 10 años de experiencia",
          activo: true,
          categorias: [],
        };
      }
    }
    res.render("pasarela-pagos", {
      experto: experto,
      usuario: experto.userId || experto,
      pageTitle: `Pago - Asesoría con ${experto.userId ? experto.userId.nombre : experto.nombre || "Experto"}`,
      expertoSeleccionado: {
        id: experto._id,
        nombre: experto.userId ? experto.userId.nombre : experto.nombre,
        apellido: experto.userId ? experto.userId.apellido || "" : experto.apellido || "",
        email: experto.userId ? experto.userId.email : experto.email,
        telefono: experto.userId ? experto.userId.telefono || "" : experto.telefono || "",
        especialidad: experto.especialidad,
        descripcion: experto.descripcion || (experto.userId
          ? `Especialista en ${experto.especialidad}`
          : `Especialista en ${experto.especialidad} con ${experto.experiencia || "varios"} años de experiencia`),
        foto: experto.userId ? experto.userId.foto || "/assets/img/default-avatar.png" : experto.foto || "/assets/img/default-avatar.png",
        categorias: experto.categorias,
      },
    });
  } catch (err) {
    res.status(500).send(`
      <div style="text-align: center; padding: 50px;">
        <h1>⚠️ Error interno del servidor</h1>
        <p>Ocurrió un error al cargar la información del experto.</p>
        <a href="/expertos.html">← Volver a la lista de expertos</a>
      </div>
    `);
  }
});

module.exports = router;
