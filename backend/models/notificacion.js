const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificacionSchema = new Schema(
  {
    email: { type: String, required: true }, // destinatario
    mensaje: { type: String, required: true },
    leida: { type: Boolean, default: false },
    fecha: { type: Date, default: Date.now },
  },
  { collection: "notificaciones" }
);

module.exports = mongoose.model("Notificacion", notificacionSchema);
