import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:5000/api";

const menu = [
  "Dashboard",
  "Book Test",
  "My Bookings",
  "Test Catalog",
  "Patients",
  "Doctors",
  "Lab Technicians",
  "Reports",
  "User Management"
];

const emptyPatient = {
  name: "",
  age: "",
  gender: "",
  phone: "",
  email: "",
  address: ""
};

const emptyTest = {
  testName: "",
  price: "",
  description: "",
  category: "",
  duration: ""
};

const emptyBooking = {
  patient: "",
  testId: "",
  appointmentDate: "",
  notes: ""
};

const emptyDoctor = {
  name: "",
  specialization: "",
  phone: "",
  email: "",
  qualification: "",
  experience: ""
};

const emptyUser = {
  name: "",
  email: "",
  phone: "",
  role: "Patient"
};

const emptyTechnician = {
  name: "",
  specialization: "",
  phone: "",
  email: "",
  qualification: "",
  experience: ""
};

function App() {
  const [page, setPage] = useState("Dashboard");
  const [role, setRole] = useState("Admin");
  const [message, setMessage] = useState("");

  // Reports states
  const [reportSearch, setReportSearch] = useState("");
  const [reportStatus, setReportStatus] = useState("All");

  // User Management states
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("All");
  const [user, setUser] = useState(emptyUser);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  // Patient states
  const [patient, setPatient] = useState(emptyPatient);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);

  // Test states
  const [test, setTest] = useState(emptyTest);
  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [searchTest, setSearchTest] = useState("");
  const [editingTestId, setEditingTestId] = useState(null);

  // Booking states
  const [booking, setBooking] = useState(emptyBooking);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Doctor states
  const [doctor, setDoctor] = useState(emptyDoctor);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState(null);

  // Lab Technician states
  const [technician, setTechnician] = useState(emptyTechnician);
  const [technicians, setTechnicians] = useState([]);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);
  const [editingTechnicianId, setEditingTechnicianId] = useState(null);

  // Load patients
  const loadPatients = async () => {
    setLoadingPatients(true);

    try {
      const response = await fetch(`${API}/patients`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load patients");
      }

      setPatients(data.patients || []);
    } catch (error) {
      setMessage("Error loading patients: " + error.message);
    } finally {
      setLoadingPatients(false);
    }
  };

  // Load tests
  const loadTests = async () => {
    setLoadingTests(true);

    try {
      const response = await fetch(`${API}/tests`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load tests");
      }

      setTests(data.tests || []);
    } catch (error) {
      setMessage("Error loading tests: " + error.message);
    } finally {
      setLoadingTests(false);
    }
  };

  // Load bookings
  const loadBookings = async () => {
    setLoadingBookings(true);

    try {
      const response = await fetch(`${API}/bookings`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load bookings");
      }

      setBookings(data.bookings || []);
    } catch (error) {
      setMessage("Error loading bookings: " + error.message);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Load doctors
  const loadDoctors = async () => {
    setLoadingDoctors(true);

    try {
      const response = await fetch(`${API}/doctors`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load doctors");
      }

      setDoctors(data.doctors || []);
    } catch (error) {
      setMessage("Error loading doctors: " + error.message);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Load lab technicians
  const loadTechnicians = async () => {
    setLoadingTechnicians(true);

    try {
      const response = await fetch(`${API}/lab-technicians`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load technicians");
      }

      setTechnicians(data.technicians || []);
    } catch (error) {
      setMessage("Error loading technicians: " + error.message);
    } finally {
      setLoadingTechnicians(false);
    }
  };

  // Load users
  const loadUsers = async () => {
    setLoadingUsers(true);

    try {
      const response = await fetch(`${API}/users`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load users");
      }

      setUsers(data.users || []);
    } catch (error) {
      setMessage("Error loading users: " + error.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load data when page changes
  useEffect(() => {
    if (page === "Patients") loadPatients();
    if (page === "Doctors") loadDoctors();
    if (page === "User Management") loadUsers();
    if (page === "Lab Technicians") loadTechnicians();
    if (page === "Test Catalog") loadTests();

    if (page === "Book Test") {
      loadPatients();
      loadTests();
    }

    if (page === "My Bookings") loadBookings();

    if (page === "Dashboard") {
      loadPatients();
      loadTests();
      loadBookings();
    }

    if (page === "Reports") {
      loadPatients();
      loadTests();
      loadBookings();
    }
  }, [page]);

  // =========================
  // PATIENT FUNCTIONS
  // =========================

  const handlePatientChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value
    });
  };

  // Register or update patient
  const registerPatient = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = editingPatientId
        ? `${API}/patients/${editingPatientId}`
        : `${API}/patients`;

      const response = await fetch(url, {
        method: editingPatientId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...patient,
          age: Number(patient.age)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save patient");
      }

      if (editingPatientId) {
        setMessage("Patient updated successfully!");
      } else {
        setMessage(
          "Patient registered successfully! Patient ID: " +
          (data.patient?.patientId || "")
        );
      }

      setPatient({ ...emptyPatient });
      setEditingPatientId(null);

      await loadPatients();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  // Edit patient
  const editPatient = (p) => {
    setPatient({
      name: p.name || "",
      age: String(p.age ?? ""),
      gender: p.gender || "",
      phone: p.phone || "",
      email: p.email || "",
      address: p.address || ""
    });

    setEditingPatientId(p._id);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Cancel patient editing
  const cancelPatientEdit = () => {
    setPatient({ ...emptyPatient });
    setEditingPatientId(null);
    setMessage("");
  };

  // Delete patient
  const deletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/patients/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage("Patient deleted successfully!");
      await loadPatients();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  // =========================
  // TEST FUNCTIONS
  // =========================

  const handleTestChange = (e) => {
    setTest({
      ...test,
      [e.target.name]: e.target.value
    });
  };

  // Add or update test
  const saveTest = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = editingTestId
        ? `${API}/tests/${editingTestId}`
        : `${API}/tests`;

      const response = await fetch(url, {
        method: editingTestId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...test,
          testName: test.testName.trim(),
          price: Number(test.price),
          description: test.description.trim(),
          category: test.category.trim(),
          duration: test.duration.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save test");
      }

      setMessage(
        editingTestId
          ? "Test updated successfully!"
          : "Test added successfully! Test ID: " +
            (data.test?.testId || "")
      );

      setTest({ ...emptyTest });
      setEditingTestId(null);

      await loadTests();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  // Edit test
  const editTest = (t) => {
    setTest({
      testName: t.testName || "",
      price: String(t.price ?? ""),
      description: t.description || "",
      category: t.category || "",
      duration: t.duration || ""
    });

    setEditingTestId(t._id);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Cancel test editing
  const cancelTestEdit = () => {
    setTest({ ...emptyTest });
    setEditingTestId(null);
    setMessage("");
  };

  // Delete test
  const deleteTest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/tests/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage("Test deleted successfully!");
      await loadTests();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const filteredTests = tests.filter((t) =>
    (t.testName || "").toLowerCase().includes(searchTest.toLowerCase())
  );

  // =========================
  // BOOKING FUNCTIONS
  // =========================

  const submitBooking = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patient: booking.patient,
          test: booking.testId,
          appointmentDate: booking.appointmentDate,
          notes: booking.notes
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      setMessage(
        "Booking created successfully! Booking ID: " +
        (data.booking?.bookingId || "")
      );

      setBooking({ ...emptyBooking });
      await loadBookings();
    } catch (error) {
      setMessage("Error creating booking: " + error.message);
    }
  };

  // Cancel booking
  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API}/bookings/${id}/cancel`, {
        method: "PUT"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not cancel booking");
      }

      setMessage("Booking cancelled successfully!");
      await loadBookings();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  // =========================
  // DOCTOR FUNCTIONS
  // =========================

  const handleDoctorChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value
    });
  };

  const saveDoctor = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = editingDoctorId
        ? `${API}/doctors/${editingDoctorId}`
        : `${API}/doctors`;

      const response = await fetch(url, {
        method: editingDoctorId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...doctor,
          name: doctor.name.trim(),
          specialization: doctor.specialization.trim(),
          phone: doctor.phone.trim(),
          email: doctor.email.trim(),
          qualification: doctor.qualification.trim(),
          experience: doctor.experience === ""
            ? undefined
            : Number(doctor.experience)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save doctor");
      }

      setMessage(
        editingDoctorId
          ? "Doctor updated successfully!"
          : "Doctor added successfully! Doctor ID: " +
            (data.doctor?.doctorId || "")
      );

      setDoctor({ ...emptyDoctor });
      setEditingDoctorId(null);

      await loadDoctors();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const editDoctor = (d) => {
    setDoctor({
      name: d.name || "",
      specialization: d.specialization || "",
      phone: d.phone || "",
      email: d.email || "",
      qualification: d.qualification || "",
      experience: d.experience == null ? "" : String(d.experience)
    });

    setEditingDoctorId(d._id);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const cancelDoctorEdit = () => {
    setDoctor({ ...emptyDoctor });
    setEditingDoctorId(null);
    setMessage("");
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/doctors/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage("Doctor deleted successfully!");
      await loadDoctors();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  // =========================
  // USER MANAGEMENT FUNCTIONS
  // =========================

  const handleUserChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const saveUser = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = editingUserId
        ? `${API}/users/${editingUserId}`
        : `${API}/users`;

      const response = await fetch(url, {
        method: editingUserId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save user");
      }

      setMessage(
        editingUserId
          ? "User updated successfully!"
          : "User added successfully! ID: " + (data.user?.userId || "")
      );

      setUser({ ...emptyUser });
      setEditingUserId(null);

      await loadUsers();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const editUser = (u) => {
    setUser({
      name: u.name || "",
      email: u.email || "",
      phone: u.phone || "",
      role: u.role || "Patient"
    });

    setEditingUserId(u._id);
    setMessage("");
  };

  const cancelUserEdit = () => {
    setUser({ ...emptyUser });
    setEditingUserId(null);
    setMessage("");
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/users/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage("User deleted successfully!");
      await loadUsers();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  // =========================
  // LAB TECHNICIAN FUNCTIONS
  // =========================

  const handleTechnicianChange = (e) => {
    setTechnician({
      ...technician,
      [e.target.name]: e.target.value
    });
  };

  const saveTechnician = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = editingTechnicianId
        ? `${API}/lab-technicians/${editingTechnicianId}`
        : `${API}/lab-technicians`;

      const response = await fetch(url, {
        method: editingTechnicianId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...technician,
          name: technician.name.trim(),
          specialization: technician.specialization.trim(),
          phone: technician.phone.trim(),
          email: technician.email.trim(),
          qualification: technician.qualification.trim(),
          experience: technician.experience === ""
            ? undefined
            : Number(technician.experience)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save lab technician");
      }

      setMessage(
        editingTechnicianId
          ? "Lab Technician updated successfully!"
          : "Lab Technician added successfully! Technician ID: " +
            (data.technician?.technicianId || "")
      );

      setTechnician({ ...emptyTechnician });
      setEditingTechnicianId(null);

      await loadTechnicians();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const editTechnician = (t) => {
    setTechnician({
      name: t.name || "",
      specialization: t.specialization || "",
      phone: t.phone || "",
      email: t.email || "",
      qualification: t.qualification || "",
      experience: t.experience == null ? "" : String(t.experience)
    });

    setEditingTechnicianId(t._id);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const cancelTechnicianEdit = () => {
    setTechnician({ ...emptyTechnician });
    setEditingTechnicianId(null);
    setMessage("");
  };

  const deleteTechnician = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lab technician?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/lab-technicians/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage("Lab Technician deleted successfully!");
      await loadTechnicians();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  // =========================
  // PAGE DISPLAY
  // =========================

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>🧪 LabCare</h2>
        <p className="side-label">MAIN MENU</p>

        {menu
          .filter((item) => {
            if (role === "Admin") return true;

            if (role === "Doctor" || role === "Lab Technician") {
              return [
                "Dashboard",
                "My Bookings",
                "Reports"
              ].includes(item);
            }

            if (role === "Patient") {
              return [
                "Dashboard",
                "Book Test",
                "My Bookings",
                "Test Catalog"
              ].includes(item);
            }

            return false;
          })
          .map((item) => (
            <button
              key={item}
              className={page === item ? "active" : ""}
              onClick={() => {
                setPage(item);
                setMessage("");
              }}
            >
              {item}
            </button>
          ))}

        <div className="sidebar-bottom">
          Online Laboratory System
        </div>
      </aside>

      {/* Main */}
      <main className="main">

        {/* Header */}
        <header className="topbar">
          <div>
            <h2>{page}</h2>
            <p>Online Laboratory Test Booking System</p>
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Patient</option>
            <option>Admin</option>
            <option>Doctor</option>
            <option>Lab Technician</option>
          </select>
        </header>

        {/* Global message */}
        {message && (
          <div className="panel">
            <p>{message}</p>
          </div>
        )}

        {/* Dashboard */}
        {page === "Dashboard" && (
          <>
            <h2>Welcome to LabCare 👋</h2>
            <p>Manage your laboratory activities in one place.</p>

            <div className="cards">
              <div className="card">
                <h3>Total Tests</h3>
                <h1>{tests.length}</h1>
                <p>Available tests</p>
              </div>

              <div className="card">
                <h3>Appointments</h3>
                <h1>
                  {bookings.filter(
                    (b) => b.status !== "Cancelled"
                  ).length}
                </h1>
                <p>Active bookings</p>
              </div>

              <div className="card">
                <h3>Reports</h3>
                <h1>05</h1>
                <p>Reports generated</p>
              </div>

              <div className="card">
                <h3>Registered Patients</h3>
                <h1>{patients.length}</h1>
                <p>Patients loaded</p>
              </div>
            </div>

            <div className="panel">
              <h2>Quick Actions</h2>

              <button onClick={() => setPage("Book Test")}>
                + Book a Test
              </button>

              <button onClick={() => setPage("My Bookings")}>
                View Bookings
              </button>

              <button onClick={() => setPage("Patients")}>
                Register Patient
              </button>

              <button onClick={() => setPage("Test Catalog")}>
                View Test Catalog
              </button>

              <button onClick={() => setPage("Reports")}>
                View Reports
              </button>
            </div>
          </>
        )}

        {/* Book Test */}
        {page === "Book Test" && (
          <div className="panel">
            <h2>Book Laboratory Test</h2>

            <form onSubmit={submitBooking}>
              <label>Select Registered Patient *</label>
              <select
                value={booking.patient}
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    patient: e.target.value
                  })
                }
                required
              >
                <option value="">Choose a patient</option>

                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} - {p.patientId}
                  </option>
                ))}
              </select>

              <label>Select Test *</label>
              <select
                value={booking.testId}
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    testId: e.target.value
                  })
                }
                required
              >
                <option value="">Choose a test</option>

                {tests.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.testName} - ₹{t.price}
                  </option>
                ))}
              </select>

              <label>Appointment Date *</label>
              <input
                type="date"
                value={booking.appointmentDate}
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    appointmentDate: e.target.value
                  })
                }
                min={new Date().toLocaleDateString("en-CA")}
                required
              />

              <label>Notes</label>
              <textarea
                value={booking.notes}
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    notes: e.target.value
                  })
                }
                placeholder="Additional information"
              />

              <button
                type="submit"
                disabled={patients.length === 0 || tests.length === 0}
              >
                Submit Booking
              </button>
            </form>

            {loadingPatients || loadingTests ? (
              <p>Loading patients and tests...</p>
            ) : patients.length === 0 ? (
              <p>Please register a patient before booking a test.</p>
            ) : tests.length === 0 ? (
              <p>No tests available. Add tests in Test Catalog first.</p>
            ) : null}
          </div>
        )}

        {/* My Bookings */}
        {page === "My Bookings" && (
          <div className="panel">
            <h2>My Laboratory Bookings</h2>

            <button onClick={loadBookings}>
              Refresh Bookings
            </button>

            {loadingBookings ? (
              <p>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p>No bookings found. Book your first laboratory test.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Patient</th>
                      <th>Test</th>
                      <th>Price</th>
                      <th>Appointment Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings
                      .filter((b) =>
                        (b.patient?.name || "")
                          .toLowerCase()
                          .includes(reportSearch.toLowerCase())
                      )
                      .filter((b) =>
                        reportStatus === "All" || b.status === reportStatus
                      )
                      .map((b) => (
                        <tr key={b._id}>
                          <td>{b.bookingId}</td>
                          <td>{b.patient?.name || "Patient unavailable"}</td>
                          <td>{b.test?.testName || "Test unavailable"}</td>
                          <td>
                            {b.test?.price != null
                              ? `₹${b.test.price}`
                              : "-"}
                          </td>
                          <td>
                            {b.appointmentDate
                              ? new Date(b.appointmentDate).toLocaleDateString("en-IN")
                              : "-"}
                          </td>
                          <td>{b.status}</td>
                          <td>
                            {b.status !== "Cancelled" &&
                              b.status !== "Completed" && (
                                <button onClick={() => cancelBooking(b._id)}>
                                  Cancel
                                </button>
                              )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Test Catalog */}
        {page === "Test Catalog" && (
          <>
            <div className="panel">
              <h2>
                {editingTestId
                  ? "Edit Laboratory Test"
                  : "Add New Laboratory Test"}
              </h2>

              <form onSubmit={saveTest}>
                <label>Test Name *</label>
                <input
                  name="testName"
                  value={test.testName}
                  onChange={handleTestChange}
                  placeholder="Example: Blood Test"
                  required
                />

                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={test.price}
                  onChange={handleTestChange}
                  placeholder="Enter test price"
                  min="0"
                  step="0.01"
                  required
                />

                <label>Category *</label>
                <select
                  name="category"
                  value={test.category}
                  onChange={handleTestChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Blood Test">Blood Test</option>
                  <option value="Urine Test">Urine Test</option>
                  <option value="Thyroid">Thyroid</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Liver Function">Liver Function</option>
                  <option value="Kidney Function">Kidney Function</option>
                  <option value="Other">Other</option>
                </select>

                <label>Duration</label>
                <input
                  name="duration"
                  value={test.duration}
                  onChange={handleTestChange}
                  placeholder="Example: 24 hours"
                />

                <label>Description</label>
                <textarea
                  name="description"
                  value={test.description}
                  onChange={handleTestChange}
                  placeholder="Enter test description"
                />

                <button type="submit">
                  {editingTestId ? "Update Test" : "Add Test"}
                </button>

                {editingTestId && (
                  <button type="button" onClick={cancelTestEdit}>
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            <div className="panel">
              <h2>Available Laboratory Tests</h2>

              <input
                type="search"
                value={searchTest}
                onChange={(e) => setSearchTest(e.target.value)}
                placeholder="Search by test name, ID or category"
              />

              <button onClick={loadTests}>
                Refresh Tests
              </button>

              {loadingTests ? (
                <p>Loading tests...</p>
              ) : filteredTests.length === 0 ? (
                <p>No laboratory tests found.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Test ID</th>
                        <th>Test Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Duration</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredTests.map((t) => (
                        <tr key={t._id}>
                          <td>{t.testId}</td>
                          <td>{t.testName}</td>
                          <td>{t.category}</td>
                          <td>₹{t.price}</td>
                          <td>{t.duration || "-"}</td>
                          <td>{t.description || "-"}</td>
                          <td>
                            <button onClick={() => editTest(t)}>
                              Edit
                            </button>

                            <button onClick={() => deleteTest(t._id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Patients */}
        {page === "Patients" && (
          <>
            <div className="panel">
              <h2>
                {editingPatientId
                  ? "Edit Patient Details"
                  : "Patient Registration"}
              </h2>

              <form onSubmit={registerPatient}>
                <label>Patient Name *</label>
                <input
                  name="name"
                  value={patient.name}
                  onChange={handlePatientChange}
                  placeholder="Enter patient name"
                  required
                />

                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={patient.age}
                  onChange={handlePatientChange}
                  placeholder="Enter age"
                  min="0"
                  required
                />

                <label>Gender *</label>
                <select
                  name="gender"
                  value={patient.gender}
                  onChange={handlePatientChange}
                  required
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
                  value={patient.phone}
                  onChange={handlePatientChange}
                  placeholder="Enter phone number"
                  required
                />

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={patient.email}
                  onChange={handlePatientChange}
                  placeholder="Enter email"
                />

                <label>Address</label>
                <textarea
                  name="address"
                  value={patient.address}
                  onChange={handlePatientChange}
                  placeholder="Enter address"
                />

                <button type="submit">
                  {editingPatientId ? "Update Patient" : "Register Patient"}
                </button>

                {editingPatientId && (
                  <button type="button" onClick={cancelPatientEdit}>
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            <div className="panel">
              <h2>Registered Patients</h2>

              <button onClick={loadPatients}>
                Refresh Patients
              </button>

              {loadingPatients ? (
                <p>Loading patients...</p>
              ) : patients.length === 0 ? (
                <p>No patients registered yet.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Phone</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {patients.map((p) => (
                        <tr key={p._id}>
                          <td>{p.patientId}</td>
                          <td>{p.name}</td>
                          <td>{p.age}</td>
                          <td>{p.gender}</td>
                          <td>{p.phone}</td>
                          <td>
                            <button onClick={() => editPatient(p)}>
                              Edit
                            </button>

                            <button onClick={() => deletePatient(p._id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Lab Technicians */}
        {page === "Lab Technicians" && (
          <>
            <div className="panel">
              <h2>
                {editingTechnicianId
                  ? "Edit Lab Technician Details"
                  : "Add New Lab Technician"}
              </h2>

              <form onSubmit={saveTechnician}>
                <label>Technician Name *</label>
                <input
                  name="name"
                  value={technician.name}
                  onChange={handleTechnicianChange}
                  placeholder="Enter technician name"
                  required
                />

                <label>Specialization *</label>
                <input
                  name="specialization"
                  value={technician.specialization}
                  onChange={handleTechnicianChange}
                  placeholder="Example: Blood Sample Collection"
                  required
                />

                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={technician.phone}
                  onChange={handleTechnicianChange}
                  placeholder="Enter phone number"
                  required
                />

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={technician.email}
                  onChange={handleTechnicianChange}
                  placeholder="Enter email address"
                />

                <label>Qualification</label>
                <input
                  name="qualification"
                  value={technician.qualification}
                  onChange={handleTechnicianChange}
                  placeholder="Example: DMLT, B.Sc MLT"
                />

                <label>Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={technician.experience}
                  onChange={handleTechnicianChange}
                  placeholder="Enter years of experience"
                  min="0"
                />

                <button type="submit">
                  {editingTechnicianId
                    ? "Update Technician"
                    : "Add Technician"}
                </button>

                {editingTechnicianId && (
                  <button type="button" onClick={cancelTechnicianEdit}>
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            <div className="panel">
              <h2>Registered Lab Technicians</h2>

              <button onClick={loadTechnicians}>
                Refresh Lab Technicians
              </button>

              {loadingTechnicians ? (
                <p>Loading lab technicians...</p>
              ) : technicians.length === 0 ? (
                <p>
                  No lab technicians registered yet. Add your first technician above.
                </p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Technician ID</th>
                        <th>Name</th>
                        <th>Specialization</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Qualification</th>
                        <th>Experience</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {technicians.map((t) => (
                        <tr key={t._id}>
                          <td>{t.technicianId}</td>
                          <td>{t.name}</td>
                          <td>{t.specialization}</td>
                          <td>{t.phone}</td>
                          <td>{t.email || "-"}</td>
                          <td>{t.qualification || "-"}</td>
                          <td>
                            {t.experience == null
                              ? "-"
                              : `${t.experience} years`}
                          </td>
                          <td>
                            <button onClick={() => editTechnician(t)}>
                              Edit
                            </button>

                            <button onClick={() => deleteTechnician(t._id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* User Management */}
        {page === "User Management" && (
          <>
            <div className="panel">
              <h2>{editingUserId ? "Edit User" : "Add New User"}</h2>

              <form onSubmit={saveUser}>
                <label>Full Name *</label>
                <input
                  name="name"
                  value={user.name}
                  onChange={handleUserChange}
                  placeholder="Enter full name"
                  required
                />

                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleUserChange}
                  placeholder="Enter email"
                  required
                />

                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleUserChange}
                  placeholder="Enter phone number"
                  required
                />

                <label>User Role *</label>
                <select
                  name="role"
                  value={user.role}
                  onChange={handleUserChange}
                  required
                >
                  <option value="Patient">Patient</option>
                  <option value="Admin">Admin</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Lab Technician">Lab Technician</option>
                </select>

                <button type="submit">
                  {editingUserId ? "Update User" : "Add User"}
                </button>

                {editingUserId && (
                  <button type="button" onClick={cancelUserEdit}>
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            <div className="panel">
              <h2>Registered Users</h2>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  margin: "15px 0",
                  flexWrap: "wrap"
                }}
              >
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                >
                  <option value="All">All Roles</option>
                  <option value="Patient">Patient</option>
                  <option value="Admin">Admin</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Lab Technician">Lab Technician</option>
                </select>
              </div>

              <button onClick={loadUsers}>Refresh Users</button>

              {loadingUsers ? (
                <p>Loading users...</p>
              ) : users.length === 0 ? (
                <p>No users registered yet.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users
                        .filter((u) =>
                          `${u.name || ""} ${u.email || ""}`
                            .toLowerCase()
                            .includes(userSearch.toLowerCase())
                        )
                        .filter((u) =>
                          userRoleFilter === "All" || u.role === userRoleFilter
                        )
                        .map((u) => (
                          <tr key={u._id}>
                            <td>{u.userId}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.phone}</td>
                            <td>{u.role}</td>
                            <td>
                              <button onClick={() => editUser(u)}>
                                Edit
                              </button>

                              <button onClick={() => deleteUser(u._id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Reports */}
        {page === "Reports" && (
          <>
            <div className="cards">
              <div className="card">
                <h3>Total Patients</h3>
                <h1>{patients.length}</h1>
              </div>

              <div className="card">
                <h3>Total Tests</h3>
                <h1>{tests.length}</h1>
              </div>

              <div className="card">
                <h3>Total Bookings</h3>
                <h1>{bookings.length}</h1>
              </div>

              <div className="card">
                <h3>Completed</h3>
                <h1>
                  {bookings.filter((b) => b.status === "Completed").length}
                </h1>
              </div>

              <div className="card">
                <h3>Pending</h3>
                <h1>
                  {bookings.filter((b) => b.status === "Pending").length}
                </h1>
              </div>

              <div className="card">
                <h3>Cancelled</h3>
                <h1>
                  {bookings.filter((b) => b.status === "Cancelled").length}
                </h1>
              </div>
            </div>

            <div className="panel">
              <h2>Laboratory Booking Reports</h2>

              <button onClick={() => window.print()}>
                Print Reports
              </button>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  margin: "15px 0",
                  flexWrap: "wrap"
                }}
              >
                <input
                  type="text"
                  placeholder="Search patient name..."
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                />

                <select
                  value={reportStatus}
                  onChange={(e) => setReportStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => {
                  loadPatients();
                  loadTests();
                  loadBookings();
                }}
              >
                Refresh Reports
              </button>

              {bookings.length === 0 ? (
                <p>No booking records available.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Patient Name</th>
                        <th>Test Name</th>
                        <th>Price</th>
                        <th>Appointment Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {bookings
                        .filter((b) =>
                          (b.patient?.name || "")
                            .toLowerCase()
                            .includes(reportSearch.toLowerCase())
                        )
                        .filter((b) =>
                          reportStatus === "All" || b.status === reportStatus
                        )
                        .map((b) => (
                          <tr key={b._id}>
                            <td>{b.bookingId}</td>
                            <td>{b.patient?.name || "Unavailable"}</td>
                            <td>{b.test?.testName || "Unavailable"}</td>
                            <td>
                              {b.test?.price != null
                                ? `₹${b.test.price}`
                                : "-"}
                            </td>
                            <td>
                              {b.appointmentDate
                                ? new Date(b.appointmentDate).toLocaleDateString("en-IN")
                                : "-"}
                            </td>
                            <td>{b.status}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Doctors */}
        {page === "Doctors" && (
          <>
            <div className="panel">
              <h2>
                {editingDoctorId ? "Edit Doctor Details" : "Add New Doctor"}
              </h2>

              <form onSubmit={saveDoctor}>
                <label>Doctor Name *</label>
                <input
                  name="name"
                  value={doctor.name}
                  onChange={handleDoctorChange}
                  placeholder="Enter doctor name"
                  required
                />

                <label>Specialization *</label>
                <input
                  name="specialization"
                  value={doctor.specialization}
                  onChange={handleDoctorChange}
                  placeholder="Example: Cardiologist"
                  required
                />

                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={doctor.phone}
                  onChange={handleDoctorChange}
                  placeholder="Enter phone number"
                  required
                />

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={doctor.email}
                  onChange={handleDoctorChange}
                  placeholder="Enter email address"
                />

                <label>Qualification</label>
                <input
                  name="qualification"
                  value={doctor.qualification}
                  onChange={handleDoctorChange}
                  placeholder="Example: MBBS, MD"
                />

                <label>Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={doctor.experience}
                  onChange={handleDoctorChange}
                  placeholder="Enter years of experience"
                  min="0"
                />

                <button type="submit">
                  {editingDoctorId ? "Update Doctor" : "Add Doctor"}
                </button>

                {editingDoctorId && (
                  <button type="button" onClick={cancelDoctorEdit}>
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            <div className="panel">
              <h2>Registered Doctors</h2>

              <button onClick={loadDoctors}>
                Refresh Doctors
              </button>

              {loadingDoctors ? (
                <p>Loading doctors...</p>
              ) : doctors.length === 0 ? (
                <p>No doctors registered yet. Add your first doctor above.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Doctor ID</th>
                        <th>Name</th>
                        <th>Specialization</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Qualification</th>
                        <th>Experience</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {doctors.map((d) => (
                        <tr key={d._id}>
                          <td>{d.doctorId}</td>
                          <td>{d.name}</td>
                          <td>{d.specialization}</td>
                          <td>{d.phone}</td>
                          <td>{d.email || "-"}</td>
                          <td>{d.qualification || "-"}</td>
                          <td>
                            {d.experience == null
                              ? "-"
                              : `${d.experience} years`}
                          </td>
                          <td>
                            <button onClick={() => editDoctor(d)}>
                              Edit
                            </button>

                            <button onClick={() => deleteDoctor(d._id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Other Pages */}
        {page !== "Dashboard" &&
          page !== "Book Test" &&
          page !== "My Bookings" &&
          page !== "Test Catalog" &&
          page !== "Patients" &&
          page !== "Doctors" &&
          page !== "Lab Technicians" &&
          page !== "Reports" &&
          page !== "User Management" && (
            <div className="panel">
              <h2>{page}</h2>
              <p>Welcome to the {page} section.</p>
              <p>
                Current role: <strong>{role}</strong>
              </p>
            </div>
          )}

        {/* Footer */}
        <footer>
          © 2026 LabCare – Laboratory Management System
        </footer>

      </main>
    </div>
  );
}

export default App;