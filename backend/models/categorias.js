const mongoose = require("mongoose");
const { Schema } = mongoose;

const categoriaSchema = new Schema(
  {
    nombre: { type: String, required: true, unique: true },
    descripcion: String,
  },
  { collection: "categorias" }
);

module.exports = mongoose.model("Categoria", categoriaSchema);
