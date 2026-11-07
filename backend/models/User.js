const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["Admin", "Doctor", "Lab Technician", "Patient"],
      required: true
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.userId) {
    this.userId = "USR" + Date.now();
  }
});

module.exports = mongoose.model("User", userSchema);