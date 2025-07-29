// Modelo de Categoría para ServiTech
const mongoose = require("mongoose");

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // Nombre obligatorio
  descripcion: { type: String }, // Descripción opcional
  fechaCreacion: { type: Date, default: Date.now }, // Fecha de creación
});

module.exports = mongoose.model("Categoria", categoriaSchema);
