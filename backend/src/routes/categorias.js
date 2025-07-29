const express = require("express");
const router = express.Router();
const Categoria = require("../models/categorias");
const Experto = require("../models/expertos");

// GET /api/categorias - Listar todas
router.get("/", async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/categorias - Crear
router.post("/", async (req, res) => {
  try {
    if (!req.body.nombre)
      return res.status(400).json({ message: "El nombre es requerido" });
    const existe = await Categoria.findOne({ nombre: req.body.nombre });
    if (existe)
      return res
        .status(400)
        .json({ message: "Ya existe una categoría con ese nombre" });
    const categoria = new Categoria({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
    });
    const nuevaCategoria = await categoria.save();
    res.status(201).json(nuevaCategoria);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/categorias/:id - Actualizar
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.nombre)
      return res.status(400).json({ message: "El nombre es requerido" });
    const existe = await Categoria.findOne({
      nombre: req.body.nombre,
      _id: { $ne: req.params.id },
    });
    if (existe)
      return res
        .status(400)
        .json({ message: "Ya existe una categoría con ese nombre" });
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      { nombre: req.body.nombre, descripcion: req.body.descripcion },
      { new: true }
    );
    if (!categoria)
      return res.status(404).json({ message: "Categoría no encontrada" });
    res.json(categoria);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/categorias/:id - Eliminar
router.delete("/:id", async (req, res) => {
  try {
    const expertos = await Experto.find({ categorias: req.params.id });
    if (expertos.length > 0) {
      return res.status(400).json({
        message: "No se puede eliminar la categoría porque tiene expertos asociados",
      });
    }
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria)
      return res.status(404).json({ message: "Categoría no encontrada" });
    res.json({ message: "Categoría eliminada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/categorias/buscar - Buscar y paginar
router.get("/buscar", async (req, res) => {
  try {
    const { q = "", page = 1, limit = 10 } = req.query;
    const query = q ? { nombre: { $regex: q, $options: "i" } } : {};
    const categorias = await Categoria.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Categoria.countDocuments(query);
    res.json({ categorias, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
