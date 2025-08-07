/**
 * MODELO DE USUARIO - SERVITECH
 * Email como identificador único. Si es experto, campo 'experto' con datos incrustados.
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const usuarioSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    usuario: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    password_hash: { type: String, required: true },
    avatar_url: String,
    es_experto: { type: Boolean, default: false },
    fecha_registro: { type: Date, default: Date.now },
    estado: {
      type: String,
      enum: ["activo", "inactivo", "suspendido"],
      default: "activo",
    },
    // Si el usuario es experto, se guarda la info aquí
    experto: {
      especialidad: String,
      descripcion: String,
      categorias: [{ nombre: String, descripcion: String, _id: false }],
      precio: Number,
      skills: [String],
      activo: { type: Boolean, default: true },
      calificacion: {
        promedio: { type: Number, default: 0 },
        total_reviews: { type: Number, default: 0 },
      },
      horario: {
        dias_disponibles: [String],
        hora_inicio: String,
        hora_fin: String,
      },
      fechaRegistro: { type: Date },
      datosBancarios: Schema.Types.Mixed, // Si necesitas datos bancarios para pagos
    },
  },
  { collection: "usuarios" }
);

module.exports = mongoose.model("Usuario", usuarioSchema);
