/**
 * Servicio para envío de correos con Nodemailer usando la cuenta oficial Servitech
 * Este servicio permite enviar correos desde Servitech usando Gmail.
 */

const nodemailer = require("nodemailer");

// Configuración del transporter usando la cuenta oficial de Servitech
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "servitech.app.correo@gmail.com", // Correo de Servitech (remitente)
    pass: "ilztlxdbxetvcqiu", // <-- Pega aquí la contraseña de aplicación generada en Gmail
  },
});

/**
 * Envía un correo desde Servitech a un destinatario
 * @param {string} destinatario - Correo al que se enviará el mensaje (ejemplo: dianacjj23@gmail.com)
 * @param {string} asunto - Asunto del correo (ejemplo: "Hola! prueba de correo servitech.")
 * @param {string} mensaje - Texto del correo (ejemplo: "Hola! prueba de correo servitech.")
 * @returns {Promise} - Información del envío si es exitoso, error si falla
 */
async function enviarCorreo(destinatario, asunto, mensaje) {
  try {
    const emailOptions = {
      from: '"Servitech" <servitech.app.correo@gmail.com>',
      to: destinatario,
      subject: asunto,
      text: mensaje,
      html: `<h2>${mensaje}</h2>`,
    };

    console.log("Intentando enviar correo a:", destinatario);
    const info = await transporter.sendMail(emailOptions);
    console.log("Correo enviado correctamente:", info);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
}

// Exporta la función para usar en rutas/controladores
module.exports = {
  enviarCorreo,
};
