const mongoose = require("mongoose");
const Usuario = require("../models/usuario");

mongoose.connect("mongodb://127.0.0.1:27017/servitech", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const usuariosExpertos = [
  {
    email: "ana.torres@email.com",
    usuario: "ana.torres",
    nombre: "Ana",
    apellido: "Torres",
    password_hash: "123456", // En producción debe ir hasheada
    es_experto: true,
    experto: {
      especialidad: "Desarrollo Web",
      descripcion: "Desarrolladora web con 5 años de experiencia.",
      categorias: [{ nombre: "Web", descripcion: "Desarrollo Web" }],
      precio: 18,
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
  {
    email: "carlos.perez@email.com",
    usuario: "carlos.perez",
    nombre: "Carlos",
    apellido: "Pérez",
    password_hash: "123456",
    es_experto: true,
    experto: {
      especialidad: "Bases de Datos",
      descripcion: "Experto en bases de datos relacionales y no relacionales.",
      categorias: [{ nombre: "DB", descripcion: "Bases de datos" }],
      precio: 20,
      skills: ["MongoDB", "SQL", "NoSQL"],
      activo: true,
      calificacion: { promedio: 4.5, total_reviews: 8 },
      horario: {
        dias_disponibles: ["Jueves", "Viernes"],
        hora_inicio: "18:00",
        hora_fin: "22:00",
      },
    },
  },
];

Usuario.insertMany(usuariosExpertos)
  .then(() => {
    console.log("Usuarios expertos insertados.");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error al insertar usuarios expertos:", err);
    mongoose.connection.close();
  });
