const express = require("express");
const router = express.Router();
const { registrar, login } = require("../controllers/usuario.controller"); // Importa funciones del controlador

// Login de usuario
router.post("/login", login);

// Registro de usuario (usa el controlador, que ya tiene el envío de correo)
router.post("/", registrar);

module.exports = router;
