// Script Node.js para listar y eliminar usuarios en MongoDB
// Uso: node backend/scripts/usuarios-tools.js

const mongoose = require("mongoose");
const Usuario = require("../models/usuario");
require("dotenv").config({ path: __dirname + "/../.env" });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const usuarios = await Usuario.find(
    {},
    { email: 1, password_hash: 1, _id: 0 }
  );
  console.log("Usuarios registrados:");
  for (const u of usuarios) {
    console.log(`Email: ${u.email}\nHash: ${u.password_hash}\n`);
    if (!u.password_hash || !u.password_hash.startsWith("$2b$")) {
      await Usuario.deleteOne({ email: u.email });
      console.log(`Usuario eliminado por hash inválido: ${u.email}`);
    }
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
