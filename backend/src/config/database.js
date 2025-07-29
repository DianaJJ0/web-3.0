// Conexión a la base de datos MongoDB
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb+srv://dianacjj23:<db_password>@adso2873441.e4hnh5b.mongodb.net/servitech?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Base de datos conectada exitosamente");
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
