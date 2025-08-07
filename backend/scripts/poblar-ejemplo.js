// Script para poblar especialidades y skills tecnológicas de ejemplo
const mongoose = require("mongoose");
const Especialidad = require("../models/especialidad");
const Skill = require("../models/skills");

const especialidades = [
  { nombre: "Desarrollo Web", descripcion: "Frontend y Backend" },
  {
    nombre: "Bases de Datos",
    descripcion: "SQL, NoSQL, modelado y optimización",
  },
  { nombre: "DevOps", descripcion: "Automatización, CI/CD, infraestructura" },
  { nombre: "Ciberseguridad", descripcion: "Seguridad informática y de redes" },
  {
    nombre: "Inteligencia Artificial",
    descripcion: "Machine Learning, Deep Learning",
  },
  {
    nombre: "Cloud Computing",
    descripcion: "AWS, Azure, GCP, servicios en la nube",
  },
  {
    nombre: "Desarrollo Móvil",
    descripcion: "Apps iOS, Android, multiplataforma",
  },
];

const skills = [
  { nombre: "JavaScript" },
  { nombre: "Python" },
  { nombre: "React" },
  { nombre: "Node.js" },
  { nombre: "Docker" },
  { nombre: "Linux" },
  { nombre: "SQL" },
  { nombre: "AWS" },
  { nombre: "Git" },
  { nombre: "C#" },
  { nombre: "Java" },
  { nombre: "Kubernetes" },
  { nombre: "MongoDB" },
  { nombre: "TypeScript" },
  { nombre: "HTML5" },
  { nombre: "CSS3" },
];

async function poblar() {
  await mongoose.connect("mongodb://localhost/servitech", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Especialidad.deleteMany({});
  await Skill.deleteMany({});
  await Especialidad.insertMany(especialidades);
  await Skill.insertMany(skills);
  console.log("Especialidades y skills tecnológicas de ejemplo insertadas.");
  await mongoose.disconnect();
}

poblar();
