// Modelos principales para login, registro y gestión básica
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Esquema de usuario
const UsuarioSchema = new Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    avatar_url: String,
    es_experto: { type: Boolean, default: false },
    fecha_registro: { type: Date, default: Date.now },
    estado: {
      type: String,
      enum: ["activo", "inactivo", "suspendido"],
      default: "activo",
    },
    experto: { type: Schema.Types.Mixed, default: null },
  },
  { collection: "usuarios" }
);

// Modelos de categorías y expertos
const Categoria = require("./categorias");
const Experto = require("./expertos");

// Exporta solo los modelos necesarios
module.exports = {
  Usuario: model("Usuario", UsuarioSchema),
  Categoria,
  Experto,
};
