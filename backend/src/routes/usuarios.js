const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); 
const { Usuario } = require("../models/models");
const jwt = require("jsonwebtoken");

// Login de usuario
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Faltan campos" });

  try {
    const user = await Usuario.findOne({ email });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });
    const passwordValida = await bcrypt.compare(password, user.password_hash);

    // Si la contraseña no es válida, retorna error
    if (!passwordValida)
      return res.status(401).json({ error: "Credenciales inválidas" });
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    const userObj = user.toObject();
    delete userObj.password_hash;
    res.json({ usuario: userObj, token });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al iniciar sesión", detalle: err.message });
  }
});

// Registro de usuario
router.post("/", async (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  if (!nombre || !apellido || !email || !password)
    return res.status(400).json({ error: "Faltan campos" });

  try {
    const existe = await Usuario.findOne({ email });
    if (existe)
      return res.status(409).json({ error: "El correo ya está registrado" });

    // Hashea la contraseña antes de guardar
    const password_hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      email,
      password_hash,
      es_experto: false,
      estado: "activo",
    });

    // Guarda el usuario en la base de datos
    try {
      const usuarioGuardado = await nuevoUsuario.save();
      const userObj = usuarioGuardado.toObject();
      delete userObj.password_hash;
      res.status(201).json({ mensaje: "Usuario creado", usuario: userObj });
    } catch (saveErr) {
      res
        .status(500)
        .json({ error: "Error al guardar usuario", detalle: saveErr.message });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al crear usuario", detalle: err.message });
  }
});

module.exports = router;
