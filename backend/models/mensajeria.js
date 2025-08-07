const mongoose = require("mongoose");
const { Schema } = mongoose;

const mensajeSchema = new Schema(
  {
    remitente_email: { type: String, required: true },
    destinatario_email: { type: String, required: true },
    contenido: { type: String, required: true },
    fecha_envio: { type: Date, default: Date.now },
  },
  { collection: "mensajes" }
);

const conversacionSchema = new Schema(
  {
    participantes: [{ type: String, required: true }], // emails de los participantes
    mensajes: [mensajeSchema],
  },
  { collection: "conversaciones" }
);

module.exports = {
  Conversacion: mongoose.model("Conversacion", conversacionSchema),
  Mensaje: mongoose.model("Mensaje", mensajeSchema),
};
