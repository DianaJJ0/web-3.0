const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models/models");
const { enviarCorreo } = require("../services/email.service"); // Importa la función de email

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
 * Al registrar, envía correo de bienvenida al usuario registrado.
 */
async function registrar(req, res) {
  // Extrae los campos del body
  const { nombre, apellido, email, password } = req.body;
  if (!nombre || !apellido || !email || !password)
    return res.status(400).json({ error: "Faltan campos" });

  try {
    // Verifica si el correo ya existe en la base de datos
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

      // Envía correo de bienvenida al usuario recién registrado
      console.log("[DEBUG] Intentando enviar correo de registro a:", email);
      try {
        await enviarCorreo(
          email, // Destinatario: correo del usuario registrado
          "Bienvenido a Servitech", // Asunto
          `Hola ${nombre}, tu registro en Servitech ha sido exitoso. ¡Gracias por unirte!` // Mensaje
        );
        console.log(
          "[DEBUG] Correo de registro enviado correctamente a:",
          email
        );
      } catch (correoErr) {
        // Si falla el envío de correo, lo muestra en consola pero NO detiene el registro
        console.log(
          "[DEBUG] Error al enviar correo de bienvenida:",
          correoErr.message
        );
      }

      // Responde con el usuario creado
      res.status(201).json({ mensaje: "Usuario creado", usuario: userObj });
    } catch (saveErr) {
      // Error al guardar el usuario en la base de datos
      console.log("[DEBUG] Error al guardar usuario:", saveErr.message);
      res
        .status(500)
        .json({ error: "Error al guardar usuario", detalle: saveErr.message });
    }
  } catch (err) {
    // Error general en el registro
    console.log("[DEBUG] Error general al crear usuario:", err.message);
    res
      .status(500)
      .json({ error: "Error al crear usuario", detalle: err.message });
  }
}


/**
 * Obtener usuario por ID
 * Busca el usuario en la base de datos usando el ID recibido en la URL.
 * No devuelve el hash de la contraseña.
 */
async function obtenerPorId(req, res) {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });
    const userObj = usuario.toObject();
    delete userObj.password_hash; // Elimina el hash de la respuesta
    res.json(userObj);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al obtener usuario", detalle: err.message });
  }
}

// Exporta las funciones del controlador
module.exports = {
  login,
  registrar,
  obtenerPorId,
};
