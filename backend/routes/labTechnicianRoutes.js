const express = require("express");
const router = express.Router();
const LabTechnician = require("../models/LabTechnician");

// Add Lab Technician
router.post("/", async (req, res) => {
  try {
    const technician = new LabTechnician({
      ...req.body,
      technicianId: "TECH" + Date.now()
    });

    await technician.save();

    res.status(201).json({
      success: true,
      message: "Lab Technician added successfully!",
      technician
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all Lab Technicians
router.get("/", async (req, res) => {
  try {
    const technicians = await LabTechnician.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      technicians
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update Lab Technician
router.put("/:id", async (req, res) => {
  try {
    const technician = await LabTechnician.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Lab Technician not found"
      });
    }

    res.json({
      success: true,
      message: "Lab Technician updated successfully!",
      technician
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete Lab Technician
router.delete("/:id", async (req, res) => {
  try {
    const technician = await LabTechnician.findByIdAndDelete(req.params.id);

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Lab Technician not found"
      });
    }

    res.json({
      success: true,
      message: "Lab Technician deleted successfully!"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;