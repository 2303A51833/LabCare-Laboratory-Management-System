
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Patient = require("./models/Patient");
const User = require("./models/User");
const Test = require("./models/Test");
const Booking = require("./models/Booking");
const Doctor = require("./models/Doctor");
const LabTechnician = require("./models/LabTechnician");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("LabCare Backend is Running!");
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Frontend and Backend Connected Successfully!"
    });
});

// Test route
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to LabCare Laboratory Management System"
    });
});

// ================= PATIENT MANAGEMENT =================

// Register Patient
app.post("/api/patients", async (req, res) => {
    try {
        const { name, age, gender, phone, email, address } = req.body;

        if (!name || age === undefined || !gender || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name, age, gender and phone are required"
            });
        }

        const patient = new Patient({
            patientId: "PAT" + Date.now(),
            name,
            age,
            gender,
            phone,
            email,
            address
        });

        await patient.save();

        res.status(201).json({
            success: true,
            message: "Patient registered successfully",
            patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get All Patients
app.get("/api/patients", async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            patients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get Patient by ID
app.get("/api/patients/:id", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.json({ success: true, patient });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update Patient
app.put("/api/patients/:id", async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.json({
            success: true,
            message: "Patient updated successfully",
            patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete Patient
app.delete("/api/patients/:id", async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.json({
            success: true,
            message: "Patient deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ================= TEST MANAGEMENT =================

// Add Test
app.post("/api/tests", async (req, res) => {
    try {
        const {
            testName,
            price,
            description,
            category,
            duration
        } = req.body;

        const newTest = new Test({
            testId: "TEST" + Date.now(),
            testName,
            price,
            description,
            category,
            duration
        });

        await newTest.save();

        res.status(201).json({
            success: true,
            message: "Test added successfully",
            test: newTest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get All Tests
app.get("/api/tests", async (req, res) => {
    try {
        const tests = await Test.find().sort({ createdAt: -1 });

        res.json({ success: true, tests });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update Test
app.put("/api/tests/:id", async (req, res) => {
    try {
        const test = await Test.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test not found"
            });
        }

        res.json({
            success: true,
            message: "Test updated successfully",
            test
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete Test
app.delete("/api/tests/:id", async (req, res) => {
    try {
        const test = await Test.findByIdAndDelete(req.params.id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test not found"
            });
        }

        res.json({
            success: true,
            message: "Test deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ================= BOOKING MANAGEMENT =================

// Create Booking
app.post("/api/bookings", async (req, res) => {
    try {
        const { patient, test, appointmentDate, notes } = req.body;

        if (!patient || !test || !appointmentDate) {
            return res.status(400).json({
                success: false,
                message: "Please provide patient, test and appointment date"
            });
        }

        const patientExists = await Patient.findById(patient);
        const testExists = await Test.findById(test);

        if (!patientExists || !testExists) {
            return res.status(404).json({
                success: false,
                message: "Patient or test not found"
            });
        }

        const booking = new Booking({
            bookingId: "BOOK" + Date.now(),
            patient,
            test,
            appointmentDate,
            notes
        });

        await booking.save();

        res.status(201).json({
            success: true,
            message: "Booking created successfully!",
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get All Bookings
app.get("/api/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("patient", "patientId name phone")
            .populate("test", "testId testName price")
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update Booking
app.put("/api/bookings/:id", async (req, res) => {
    try {
        const { appointmentDate, notes, status } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { appointmentDate, notes, status },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.json({
            success: true,
            message: "Booking updated successfully!",
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Cancel Booking
app.put("/api/bookings/:id/cancel", async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: "Cancelled" },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.json({
            success: true,
            message: "Booking cancelled successfully!",
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ================= DOCTOR MANAGEMENT =================

// Add Doctor
app.post("/api/doctors", async (req, res) => {
    try {
        const {
            name,
            specialization,
            phone,
            email,
            qualification,
            experience
        } = req.body;

        if (!name || !specialization || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name, specialization and phone are required"
            });
        }

        const doctor = new Doctor({
            doctorId: "DOC" + Date.now(),
            name,
            specialization,
            phone,
            email,
            qualification,
            experience
        });

        await doctor.save();

        res.status(201).json({
            success: true,
            message: "Doctor added successfully",
            doctor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get All Doctors
app.get("/api/doctors", async (req, res) => {
    try {
        const doctors = await Doctor.find().sort({ createdAt: -1 });

        res.json({ success: true, doctors });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update Doctor
app.put("/api/doctors/:id", async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        res.json({
            success: true,
            message: "Doctor updated successfully",
            doctor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete Doctor
app.delete("/api/doctors/:id", async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        res.json({
            success: true,
            message: "Doctor deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ================= LAB TECHNICIAN MANAGEMENT =================

// Add Lab Technician
app.post("/api/lab-technicians", async (req, res) => {
    try {
        const {
            name,
            specialization,
            phone,
            email,
            qualification,
            experience
        } = req.body;

        if (!name || !specialization || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name, specialization and phone are required"
            });
        }

        const technician = new LabTechnician({
            technicianId: "TECH" + Date.now(),
            name,
            specialization,
            phone,
            email,
            qualification,
            experience
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

// Get All Lab Technicians
app.get("/api/lab-technicians", async (req, res) => {
    try {
        const technicians = await LabTechnician.find()
            .sort({ createdAt: -1 });

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
app.put("/api/lab-technicians/:id", async (req, res) => {
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
app.delete("/api/lab-technicians/:id", async (req, res) => {
    try {
        const technician = await LabTechnician.findByIdAndDelete(
            req.params.id
        );

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
// ================= USER MANAGEMENT =================

// Add User
app.post("/api/users", async (req, res) => {
    try {
        const { name, email, phone, role } = req.body;

        if (!name || !email || !phone || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const user = new User({
            userId: "USR" + Date.now(),
            name,
            email,
            phone,
            role
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "User added successfully!",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get All Users
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update User
app.put("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "User updated successfully!",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete User
app.delete("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
// ================= SERVER AND DATABASE =================

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error.message);
    });
