const mongoose = require("mongoose");
const { Schema } = mongoose;

const reseñaSchema = new Schema(
  {
    experto_email: { type: String, required: true }, // email del experto
    usuario_email: { type: String, required: true }, // email del usuario que opina
    comentario: { type: String, required: true },
    calificacion: { type: Number, min: 1, max: 5, required: true },
    fecha: { type: Date, default: Date.now },
  },
  { collection: "reseñas" }
);

module.exports = mongoose.model("Reseña", reseñaSchema);
