const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");

// Login de usuario
// Establecer sesión después de login
router.post("/session", async (req, res) => {
  const { email } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    req.session.usuarioId = usuario._id.toString();
    res.json({ mensaje: "Sesión iniciada", usuarioId: usuario._id });
  } catch (err) {
    res.status(500).json({ error: "Error al establecer sesión." });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    // Comparar la contraseña con bcrypt
    const esValida = await bcrypt.compare(password, usuario.password_hash);
    if (!esValida) {
      return res.status(401).json({ error: "Contraseña incorrecta." });
    }
    // Asigna la sesión de usuario
    req.session.usuarioId = usuario._id.toString();
    res.json({ mensaje: "Login exitoso", usuario, token: "token-demo" });
  } catch (err) {
    res.status(500).json({ error: "Error al iniciar sesión." });
  }
});

// Registro de usuario
router.post("/registro", async (req, res) => {
  const { email, usuario, nombre, apellido, password } = req.body;
  try {
    const existe = await Usuario.findOne({ email });
    if (existe)
      return res.status(400).json({ error: "El email ya está registrado." });
    // Hashear la contraseña antes de guardar
    const hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({
      email,
      usuario,
      nombre,
      apellido,
      password_hash: hash,
    });
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: "Usuario registrado correctamente." });
  } catch (err) {
    res.status(500).json({ error: "Error al registrar usuario." });
  }
});

// Obtener usuario por email
router.get("/:email", async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ email: req.params.email });
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado." });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: "Error al buscar usuario." });
  }
});
// Verificar sesión activa
router.get("/session", (req, res) => {
  if (req.session && req.session.usuarioId) {
    res.json({ usuarioId: req.session.usuarioId });
  } else {
    res.status(401).json({ error: "No autenticado" });
  }
});

module.exports = router;
