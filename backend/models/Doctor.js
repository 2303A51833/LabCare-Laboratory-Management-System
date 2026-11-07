
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
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
      type: String,
      trim: true,
      lowercase: true
    },
    qualification: {
      type: String
    },
    experience: {
      type: Number,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
