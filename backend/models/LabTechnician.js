const mongoose = require("mongoose");

const labTechnicianSchema = new mongoose.Schema(
  {
    technicianId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    specialization: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    qualification: {
      type: String
    },
    experience: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("LabTechnician", labTechnicianSchema);