const mongoose = require("mongoose");
const Usuario = require("../models/usuario");

mongoose.connect("mongodb://127.0.0.1:27017/servitech", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function eliminarExpertosDuplicados() {
  try {
    const resultado = await Usuario.deleteMany({
      usuario: { $in: ["ana.torres", "carlos.perez"] },
    });
    console.log("Usuarios eliminados:", resultado.deletedCount);
  } catch (err) {
    console.error("Error al eliminar usuarios duplicados:", err);
  } finally {
    mongoose.connection.close();
  }
}

eliminarExpertosDuplicados();
