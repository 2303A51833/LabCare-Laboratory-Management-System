
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    patientId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"]
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
    address: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Patient", patientSchema);
