const mongoose = require("mongoose");
const { Schema } = mongoose;

const especialidadSchema = new Schema(
  {
    nombre: { type: String, required: true, unique: true },
    descripcion: String,
  },
  { collection: "especialidades" }
);

module.exports = mongoose.model("Especialidad", especialidadSchema);
