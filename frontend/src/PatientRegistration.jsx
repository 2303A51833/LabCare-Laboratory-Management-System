
import { useState } from "react";

function PatientRegistration() {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        address: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch("http://localhost:5000/api/patients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    age: Number(formData.age)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            setMessage("Patient registered successfully! Patient ID: " + data.patient.patientId);

            setFormData({
                name: "",
                age: "",
                gender: "",
                phone: "",
                email: "",
                address: ""
            });

        } catch (error) {
            setMessage("Error: " + error.message);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "30px auto", padding: "25px", fontFamily: "Arial" }}>
            <h2>LabCare - Patient Registration</h2>

            <form onSubmit={handleSubmit}>
                <label>Patient Name *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label>Age *</label>
                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="0"
                    required
                    style={inputStyle}
                />

                <label>Gender *</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <label>Phone Number *</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <label>Address</label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <button type="submit" style={buttonStyle}>
                    Register Patient
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0 18px",
    boxSizing: "border-box"
};

const buttonStyle = {
    padding: "12px 20px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px"
};

export default PatientRegistration;
