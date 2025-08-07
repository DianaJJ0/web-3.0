const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");

// Listar expertos
router.get("/", async (req, res) => {
  try {
    const expertos = await Usuario.find({ es_experto: true });
    res.render("expertos", { expertos });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener expertos." });
  }
});

module.exports = router;
