const express = require("express");
const router = express.Router();
const Categoria = require("../models/categorias");

// Crear categoría
router.post("/crear", async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const existe = await Categoria.findOne({ nombre });
    if (existe)
      return res.status(400).json({ error: "La categoría ya existe." });
    const nuevaCategoria = new Categoria({ nombre, descripcion });
    await nuevaCategoria.save();
    res.status(201).json({ mensaje: "Categoría creada correctamente." });
  } catch (err) {
    res.status(500).json({ error: "Error al crear categoría." });
  }
});

// Listar categorías
router.get("/", async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener categorías." });
  }
});

module.exports = router;
