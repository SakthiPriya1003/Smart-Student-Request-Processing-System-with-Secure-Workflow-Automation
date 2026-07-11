// client/src/pages/Register.js

//import { useState, useEffect } from "react";
//import API from "../services/api";
//import { Link } from "react-router-dom";

//function Register() {
  //const [form, setForm] = useState({
    //name: "",
    //email: "",
    //password: "",
    //role: "student",
    //department: "",
    //year: "",
    //section: "",
    //tutor: ""
  //});

  //const [tutors, setTutors] = useState([]);
  //const [loading, setLoading] = useState(false);

  // Fetch tutors when department/year/section changes (for students)
  //useEffect(() => {
    //if (form.role === "student" && form.department && form.year && form.section) {
      //fetchTutors();
    //}
  //}, [form.department, form.year, form.section, form.role]);

  //const fetchTutors = async () => {
    //try {
      //const res = await API.get(
        //`/tutors?department=${form.department}&year=${form.year}&section=${form.section}`
      //);
      //setTutors(res.data);
      //setForm((prev) => ({ ...prev, tutor: "" }));
    //} catch (err) {
      //console.error("Error fetching tutors:", err);
    //}
  //};

  //const handleChange = (e) => {
    //setForm({ ...form, [e.target.name]: e.target.value });
  //};

  //const handleSubmit = async (e) => {
    //e.preventDefault();
    //setLoading(true);

    //try {
      //const payload = { ...form };

      // Remove tutor field if not student
      //if (payload.role !== "student") {
        //delete payload.tutor;
      //}

      //await API.post("/auth/register", payload);

      //alert("Registration successful! Please login.");
      //window.location = "/";
    //} catch (err) {
      //alert(err.response?.data?.message || "Registration failed");
    //} finally {
      //setLoading(false);
    //}
  //};

  //const years = ["I", "II", "III", "IV"];
  //const departments = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];
  //const sections = ["A", "B", "C", "D"];

  //return (
    // UPDATED: auth-container (Colorful Mesh Background)
    //<div className="auth-container">
      
      //<div className="auth-card">
        
        //{/* UPDATED: auth-header (Gradient Header) */}
        //<div className="auth-header">
          //<h3 className="mb-0">
            //<i className="bi bi-person-plus-fill me-2"></i>Create Account
          //</h3>
          //<p className="mb-0 opacity-75">Join the Smart Request System</p>
        //</div>

        //<div className="card-body p-4">
          //<form onSubmit={handleSubmit}>
            
            //<div className="mb-3">
              //<label className="form-label fw-bold small text-muted">Full Name</label>
              //<input
                //type="text"
                //className="form-control"
                //name="name"
                //value={form.name}
                //onChange={handleChange}
                //required
              ///>
            //</div>

            //<div className="mb-3">
              //<label className="form-label fw-bold small text-muted">Email</label>
              //<input
                //type="email"
                //className="form-control"
                //name="email"
                //value={form.email}
                //onChange={handleChange}
                //required
              ///>
            //</div>

            //<div className="mb-3">
              //<label className="form-label fw-bold small text-muted">Password</label>
              //<input
                //type="password"
                //className="form-control"
                //name="password"
                //value={form.password}
                //onChange={handleChange}
                //required
                //minLength="6"
              ///>
            //</div>

            //<div className="mb-3">
              //<label className="form-label fw-bold small text-muted">Role</label>
              //<select
                //className="form-select"
                //name="role"
                //value={form.role}
                //onChange={handleChange}
                //required
              //>
                //<option value="student">Student</option>
                //<option value="tutor">Tutor</option>
                //<option value="hod">HOD</option>
              //</select>
            //</div>

            //<div className="mb-3">
              //<label className="form-label fw-bold small text-muted">Department</label>
              //<select
                //className="form-select"
                //name="department"
                //value={form.department}
                //onChange={handleChange}
                //required
              //>
                //<option value="">-- Select --</option>
                //{departments.map((d) => (
                  //<option key={d} value={d}>{d}</option>
                //))}
              //</select>
            //</div>

            //<div className="mb-3">
              //<label className="form-label fw-bold small text-muted">Year</label>
              //<select
                //className="form-select"
                //name="year"
                //value={form.year}
                //onChange={handleChange}
                //required
              //>
                //<option value="">-- Select --</option>
                //{years.map((y) => (
                  //<option key={y} value={y}>{y}</option>
                //))}
              //</select>
            //</div>

            //<div className="mb-3">
              //<label className="form-label fw-bold small text-muted">Section</label>
              //<select
                //className="form-select"
                //name="section"
                //value={form.section}
                //onChange={handleChange}
                //required
              //>
                //<option value="">-- Select --</option>
                //{sections.map((s) => (
                  //<option key={s} value={s}>{s}</option>
                //))}
              //</select>
            //</div>

            //{/* Tutor Selection - Only for Students */}
            //{form.role === "student" && (
              //<div className="mb-3">
                //<label className="form-label fw-bold small text-muted">Assign Tutor</label>
                //<select
                  //className="form-select"
                  //name="tutor"
                  //value={form.tutor}
                  //onChange={handleChange}
                  //required
                  //disabled={!form.department || !form.year || !form.section}
                //>
                  //<option value="">
                    //{tutors.length === 0
                      //? "Select details above first"
                      //: "-- Select Tutor --"}
                  //</option>
                  //{tutors.map((t) => (
                    //<option key={t._id} value={t._id}>
                      //{t.name}
                    //</option>
                  //))}
                //</select>
                //{tutors.length === 0 &&
                  //form.department &&
                  //form.year &&
                  //form.section && (
                    //<small className="text-muted d-block mt-1">
                      //No tutors found for this class
                    //</small>
                  //)}
              //</div>
            //)}

            //<button
              //type="submit"
              //className="btn btn-primary w-100 py-2 fw-bold mt-2"
              //disabled={loading}
            //>
              //{loading ? (
                //<span className="spinner-border spinner-border-sm me-2"></span>
              //) : (
                //<i className="bi bi-person-check-fill me-2"></i>
              //)}
              //Register
            //</button>
          //</form>

          //<p className="mt-4 text-center mb-0">
            //Already have an account? <Link to="/" className="text-decoration-none fw-bold">Login</Link>
          //</p>
        //</div>

      //</div>
    //</div>
  //);
//}

//export default Register;

import { useState, useEffect } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
    year: "",
    section: "",
    tutor: ""
  });

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ UPDATED: Expanded Department List
  const departments = [
    "AIDS",
    "BME",
    "CIVIL",
    "CSE",
    "CSE(AIML)",
    "CSE(Cyber Security)",
    "CSBS",
    "ECE",
    "EEE",
    "IT",
    "MECH",
    "VLSI"
  ];

  const years = ["I", "II", "III", "IV"];
  const sections = ["A", "B", "C", "D"];

  // Fetch tutors when department/year/section changes (for students)
  useEffect(() => {
    if (form.role === "student" && form.department && form.year && form.section) {
      fetchTutors();
    } else {
      setTutors([]); // Clear tutors if role changes or fields clear
    }
  }, [form.department, form.year, form.section, form.role]);

  const fetchTutors = async () => {
    try {
      const res = await API.get(
        `/tutors?department=${form.department}&year=${form.year}&section=${form.section}`
      );
      setTutors(res.data);
      setForm((prev) => ({ ...prev, tutor: "" }));
    } catch (err) {
      console.error("Error fetching tutors:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...form };

      // Remove tutor field if not student
      if (payload.role !== "student") {
        delete payload.tutor;
      }

      // ✅ ADDED: Send dummy values for HOD so MongoDB required schema doesn't crash
      if (payload.role === "hod") {
        payload.year = "N/A";
        payload.section = "N/A";
      }

      await API.post("/auth/register", payload);

      alert("Registration successful! Please login.");
      window.location = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADDED: Logic to hide Year/Section if HOD is selected
  const showYearAndSection = form.role !== "hod";

  return (
    <div className="auth-container">
      
      <div className="auth-card">
        
        <div className="auth-header">
          <h3 className="mb-0">
            <i className="bi bi-person-plus-fill me-2"></i>Create Account
          </h3>
          <p className="mb-0 opacity-75">Join the Smart Request System</p>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            
            <div className="mb-3">
              <label className="form-label fw-bold small text-muted">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small text-muted">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small text-muted">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small text-muted">Role</label>
              <select
                className="form-select"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
                <option value="hod">HOD</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small text-muted">Department</label>
              <select
                className="form-select"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              >
                <option value="">-- Select --</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* ✅ UPDATED: Only show Year and Section if role is NOT HOD */}
            {showYearAndSection && (
              <>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted">Year</label>
                  <select
                    className="form-select"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select --</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted">Section</label>
                  <select
                    className="form-select"
                    name="section"
                    value={form.section}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select --</option>
                    {sections.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Tutor Selection - Only for Students */}
            {form.role === "student" && (
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">Assign Tutor</label>
                <select
                  className="form-select"
                  name="tutor"
                  value={form.tutor}
                  onChange={handleChange}
                  required
                  disabled={!form.department || !form.year || !form.section}
                >
                  <option value="">
                    {tutors.length === 0
                      ? "Select details above first"
                      : "-- Select Tutor --"}
                  </option>
                  {tutors.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {tutors.length === 0 &&
                  form.department &&
                  form.year &&
                  form.section && (
                    <small className="text-muted d-block mt-1">
                      No tutors found for this class
                    </small>
                  )}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-bold mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <i className="bi bi-person-check-fill me-2"></i>
              )}
              Register
            </button>
          </form>

          <p className="mt-4 text-center mb-0">
            Already have an account? <Link to="/" className="text-decoration-none fw-bold">Login</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;