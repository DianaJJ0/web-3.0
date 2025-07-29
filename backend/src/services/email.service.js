const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const transportador = nodemailer.createTransport({
    service: "gmail",
    auth: {
    user: "dianacjj23@gmail.com",
    pass: "bggqenecpachvbfq",
  },
});

transportador.sendMail(info, function(error, info) {
    if (error) {
      console.log('Error:',error.message)
    }
    else{
        console.log('envio exitoso:',info.response)
    }
});

function configurarCorreo(remitente, destinatario, asunto) {
  const info={
    from:remitente, 
    to: destinatario,
    subject: asunto, 
    text: "cuerpo del correo de prueba", 
    html: "<h2>hola desde servitech!</h2>", 
  };

  transportador.sendMail(info, function(error, info) {
    if (error) {
      console.log('Error:',error.message)
    }
    else{
        console.log('envio exitoso:',info.response)
    }
})
}