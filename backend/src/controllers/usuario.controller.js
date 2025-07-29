const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models/models");
const { configurarCorreo } = require("../services/email.service"); // Importa la función de email

/** Login de usuario
 */
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Faltan campos" });

  try {
    const user = await Usuario.findOne({ email });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });
    const passwordValida = await bcrypt.compare(password, user.password_hash);
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
}

/**
 * Registro de usuario
 */
async function registrar(req, res) {
  const { nombre, apellido, email, password } = req.body;
  if (!nombre || !apellido || !email || !password)
    return res.status(400).json({ error: "Faltan campos" });

  try {
    const existe = await Usuario.findOne({ email });
    if (existe)
      return res.status(409).json({ error: "El correo ya está registrado" });

    const password_hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      email,
      password_hash,
      es_experto: false,
      estado: "activo",
    });

    try {
      const usuarioGuardado = await nuevoUsuario.save();
      const userObj = usuarioGuardado.toObject();
      delete userObj.password_hash;

      // Enviar correo de bienvenida al nuevo usuario
      try {
        await configurarCorreo(
          "dianacjj23@gmail.com", // Remitente (según email.service.js)
          
          email, // Destinatario: correo del usuario registrado
          "Bienvenido a Servitech"
        );
      } catch (correoErr) {
        console.log("Error al enviar correo de bienvenida:", correoErr.message);
        // No detiene el registro si falla el correo
      }

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
}

/**
 * Obtener usuario por ID
 */
async function obtenerPorId(req, res) {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    const userObj = usuario.toObject();
    delete userObj.password_hash;
    res.json(userObj);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuario", detalle: err.message });
  }
}

module.exports = {
  login,
  registrar,
  obtenerPorId,
};
