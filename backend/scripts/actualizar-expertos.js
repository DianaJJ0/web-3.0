const mongoose = require("mongoose");
const Usuario = require("../models/usuario");

mongoose.connect("mongodb://127.0.0.1:27017/servitech", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function actualizarExpertos() {
  try {
    const resultado = await Usuario.updateMany(
      { es_experto: true },
      {
        $set: {
          experto: {
            especialidad: "Desarrollo Web",
            descripcion: "Experto en desarrollo web y tecnologías modernas.",
            categorias: [{ nombre: "Web", descripcion: "Desarrollo Web" }],
            precio: 25,
            skills: ["JavaScript", "React", "Node.js"],
            activo: true,
            calificacion: { promedio: 5, total_reviews: 10 },
            horario: {
              dias_disponibles: ["Lunes", "Martes", "Miércoles"],
              hora_inicio: "09:00",
              hora_fin: "17:00",
            },
          },
        },
      }
    );
    console.log("Expertos actualizados:", resultado.modifiedCount);
  } catch (err) {
    console.error("Error al actualizar expertos:", err);
  } finally {
    mongoose.connection.close();
  }
}

actualizarExpertos();
