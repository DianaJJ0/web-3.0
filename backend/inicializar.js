/**
 *  SCRIPT DE INICIALIZACIÓN - SERVITECH
 * Configura modelos, datos iniciales
 */

const mongoose = require("mongoose");
require("dotenv").config();

// Importar función de conexión a la base de datos
const conectarBaseDatos = require("./src/config/database");

// Importar modelos
const { Usuario, Categoria, Experto } = require("./src/models/models");

/* Crear categorías predeterminadas*/
async function crearCategoriasPredeterminadas() {
  console.log(" Creando categorías predeterminadas...");

  // Definir categorías predeterminadas
  const categorias = [
    {
      nombre: "Tecnología e Informática",
      descripcion: "Soporte técnico, programación, redes y sistemas",
    },
    {
      nombre: "Diseño y Creatividad",
      descripcion: "Diseño gráfico, web, UX/UI y contenido visual",
    },
    {
      nombre: "Marketing Digital",
      descripcion: "SEO, SEM, redes sociales y estrategias online",
    },
    {
      nombre: "Negocios y Finanzas",
      descripcion: "Consultoría empresarial, contabilidad y finanzas",
    },
    {
      nombre: "Legal y Jurídico",
      descripcion: "Asesoría legal, contratos y normatividad",
    },
    {
      nombre: "Educación y Tutorías",
      descripcion: "Clases particulares, idiomas y preparación académica",
    },
    {
      nombre: "Salud y Bienestar",
      descripcion: "Consultas médicas, nutrición y bienestar personal",
    },
    {
      nombre: "Arquitectura e Ingeniería",
      descripcion: "Diseño arquitectónico, cálculos y planos técnicos",
    },
  ];

  let contador = 0;
  for (const categoria of categorias) {
    try {
      await Categoria.findOneAndUpdate(
        { nombre: categoria.nombre },
        categoria,
        { upsert: true, new: true }
      );
      contador++;
    } catch (error) {
      console.error(
        ` Error creando categoría ${categoria.nombre}:`,
        error.message
      );
    }
  }

  console.log(` ${contador} categorías creadas/actualizadas`);
}

/* Crear usuarios de prueba */
async function crearUsuariosPrueba() {
  console.log("Creando usuarios de prueba...");
  const usuarios = [
    {
      nombre: "María",
      apellido: "Rodríguez",
      email: "experto@test.com",
      password: "experto123",
    },
    {
      nombre: "Carlos",
      apellido: "Hernández",
      email: "carlos@expertos.com",
      password: "carlos123",
    },
  ];
  let contador = 0;
  for (const usuario of usuarios) {
    try {
      await Usuario.findOneAndUpdate({ email: usuario.email }, usuario, {
        upsert: true,
        new: true,
      });
      contador++;
    } catch (error) {
      console.error(`Error creando usuario ${usuario.email}:`, error.message);
    }
  }
  console.log(` ${contador} usuarios creados/actualizados`);
}

/* Crear expertos de prueba */
async function crearExpertosPrueba() {
  console.log("Creando expertos de prueba...");
  // Usa email para asociar expertos a usuarios
  const expertos = [
    {
      email: "experto@test.com",
      especialidad: "Desarrollo Web",
      descripcion: "10 años de experiencia en desarrollo web y aplicaciones.",
      foto: "/assets/img/default-avatar.png",
    },
    {
      email: "carlos@expertos.com",
      especialidad: "Soporte Técnico",
      descripcion: "Especialista en soporte técnico y redes.",
      foto: "/assets/img/default-avatar.png",
    },
  ];
  let contador = 0;
  for (const experto of expertos) {
    if (!experto.email) continue;
    try {
      await Experto.findOneAndUpdate({ email: experto.email }, experto, {
        upsert: true,
        new: true,
      });
      contador++;
    } catch (error) {
      console.error(`Error creando experto:`, error.message);
    }
  }
  console.log(` ${contador} expertos creados/actualizados`);
}

// Inicialización simplificada solo para usuarios y categorías
async function inicializar() {
  console.log(" Iniciando configuración básica de ServiTech...\n");
  const conectado = await conectarBaseDatos();
  if (!conectado) {
    process.exit(1);
  }
  try {
    await crearCategoriasPredeterminadas();
    await crearUsuariosPrueba();
    await crearExpertosPrueba(); // <-- Agrega esta línea

    // SCRIPT DE INICIALIZACIÓN - SERVITECH
    // Configura modelos, datos iniciales y credenciales de prueba
    console.log("   Cliente: cliente@test.com / cliente123");
    console.log("   Experto: experto@test.com / experto123");
  } catch (error) {
    console.error("\n Error durante la inicialización:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n Conexión a base de datos cerrada");
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  inicializar();
}

// Exportar solo funciones definidas en este archivo
module.exports = {
  conectarBaseDatos,
  crearCategoriasPredeterminadas,
  crearUsuariosPrueba,
  crearExpertosPrueba,
  inicializar,
};
