
const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    testId: {
      type: String,
      unique: true
    },
    testName: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: true
    },
    duration: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Test", testSchema);
