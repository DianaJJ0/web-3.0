const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String },
});

module.exports = mongoose.model("Skill", SkillSchema);
