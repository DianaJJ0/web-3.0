const mongoose = require("mongoose");
const { Schema } = mongoose;

const asesoriaSchema = new Schema(
  {
    // Puedes ajustar los campos según tu lógica de negocio
    usuario_email: { type: String, required: true }, // email del usuario que solicita
    experto_email: { type: String, required: true }, // email del experto
    fecha: { type: Date, required: true },
    estado: {
      type: String,
      enum: ["pendiente", "confirmada", "cancelada"],
      default: "pendiente",
    },
    descripcion: String,
    // Otros campos relevantes para la asesoría
  },
  { collection: "asesorias" }
);

module.exports = mongoose.model("Asesoria", asesoriaSchema);
