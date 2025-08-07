// Importa modelos definidos en archivos separados
const Usuario = require("./usuario");
const Asesoria = require("./asesoria");
const { Conversacion, Mensaje } = require("./mensajeria");
const Notificacion = require("./notificacion");
const Reseña = require("./reseña");
const Categoria = require("./categorias");

// Exporta todos los modelos para usarlos en el resto de la aplicación
module.exports = {
  Usuario,
  Asesoria,
  Conversacion,
  Mensaje,
  Notificacion,
  Reseña,
  Categoria,
};
