const mongoose = require("mongoose");
const Usuario = require("../models/usuario");

mongoose.connect("mongodb://127.0.0.1:27017/servitech", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function listarExpertos() {
  try {
    const expertos = await Usuario.find({ es_experto: true });
    if (expertos.length === 0) {
      console.log("No hay expertos en la base de datos.");
    } else {
      console.log("Expertos encontrados:");
      expertos.forEach((e) => {
        console.log(
          `- ${e.nombre} ${e.apellido} | usuario: ${e.usuario} | email: ${e.email}`
        );
      });
    }
  } catch (err) {
    console.error("Error al listar expertos:", err);
  } finally {
    mongoose.connection.close();
  }
}

listarExpertos();
