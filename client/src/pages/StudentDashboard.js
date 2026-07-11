/*import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function StudentDashboard() {
  const studentName = localStorage.getItem("name") || "";
  const token = localStorage.getItem("token");

  // Form state
  const [requestType, setRequestType] = useState("");
  const [reason, setReason] = useState("");
  const [numDays, setNumDays] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [document, setDocument] = useState(null);

  // Data state
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchTutors();
    fetchMyRequests();
  }, []);

  const fetchTutors = async () => {
    try {
      const res = await API.get("/tutors");
      setTutors(res.data);
      if (res.data.length > 0) {
        setSelectedTutor(res.data[0].name);
      }
    } catch (err) {
      console.error("Error fetching tutors:", err);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const res = await API.get("/requests/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  // Dynamic form logic
  const showDateFields = requestType === "OD" || requestType === "Leave";
  const showReasonField = requestType !== "Marksheet";
  const showMultiDate = showDateFields && parseInt(numDays) > 1;
  const showSingleDate = showDateFields && parseInt(numDays) === 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("tutorName", selectedTutor);
      formData.append("requestType", requestType);
      formData.append("reason", reason);
      formData.append("numDays", numDays);
      formData.append("fromDate", fromDate);

      if (document) {
        formData.append("document", document);
      }

      await API.post("/requests", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Request submitted successfully!");

      // Reset form
      setRequestType("");
      setReason("");
      setNumDays(1);
      setFromDate("");
      setDocument(null);
      e.target.reset();

      fetchMyRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  // Status badge colors
  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-warning text-dark",
      tutor_approved: "bg-info text-dark",
      tutor_rejected: "bg-danger",
      hod_approved: "bg-success",
      hod_rejected: "bg-secondary"
    };
    return badges[status] || "bg-secondary";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Pending",
      tutor_approved: "Tutor Approved",
      tutor_rejected: "Tutor Rejected",
      hod_approved: "HOD Approved",
      hod_rejected: "HOD Rejected"
    };
    return texts[status] || status;
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getDateDisplay = (req) => {
    if (req.requestType === "Marksheet") return "N/A";
    if (req.numDays === 1) return formatDate(req.date);
    return `${formatDate(req.fromDate)} → ${formatDate(req.toDate)}`;
  };

  return (
    <>
      <Navbar />
      
      {/* ========================
          COLORFUL STATS BAR
          ======================== }
      <div className="container-fluid mb-4" style={{ marginTop: '20px' }}>
        <div className="row g-3 px-4">
          
          {/* Total Requests }
          <div className="col-md-4">
            <div className="stat-card shadow-sm border-0">
              <div>
                <h6 className="text-muted text-uppercase mb-1" style={{fontSize: '0.75rem', fontWeight: '700'}}>Total Requests</h6>
                <h2 className="fw-bold mb-0">{requests.length}</h2>
              </div>
              <div className="stat-icon">
                <i className="bi bi-file-earmark-text"></i>
              </div>
            </div>
          </div>

          {/* Pending }
          <div className="col-md-4">
            <div className="stat-card shadow-sm border-0">
              <div>
                <h6 className="text-muted text-uppercase mb-1" style={{fontSize: '0.75rem', fontWeight: '700'}}>Pending</h6>
                <h2 className="fw-bold mb-0 text-warning">
                  {requests.filter(r => r.status === 'pending').length}
                </h2>
              </div>
              <div className="stat-icon bg-warning">
                <i className="bi bi-clock-history text-white"></i>
              </div>
            </div>
          </div>

          {/* Approved }
          <div className="col-md-4">
            <div className="stat-card shadow-sm border-0">
              <div>
                <h6 className="text-muted text-uppercase mb-1" style={{fontSize: '0.75rem', fontWeight: '700'}}>Approved</h6>
                <h2 className="fw-bold mb-0 text-success">
                  {requests.filter(r => r.status === 'hod_approved' || r.status === 'tutor_approved').length}
                </h2>
              </div>
              <div className="stat-icon bg-success">
                <i className="bi bi-check-circle-fill text-white"></i>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================
          MAIN DASHBOARD CONTENT
          ======================== }
      <div className="container mt-2 pb-5">
        <div className="row g-4">
          
          {/* ===== REQUEST FORM (Left) ===== }
          <div className="col-md-5">
            <div className="card h-100 border-0 shadow">
              <div className="card-header bg-transparent border-0 pt-4 pb-0">
                <h4 className="fw-bold text-primary mb-0">
                  <i className="bi bi-plus-circle-fill me-2"></i>New Request
                </h4>
                <p className="text-muted small">Submit a new leave or OD request</p>
              </div>
              <div className="card-body pt-3">
                <form onSubmit={handleSubmit}>

                  {/* Request Type }
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Request Type</label>
                    <select
                      className="form-select"
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      required
                    >
                      <option value="">-- Select Type --</option>
                      <option value="OD">OD (On Duty)</option>
                      <option value="Leave">Leave</option>
                      <option value="Bonafide">Bonafide Certificate</option>
                      <option value="Marksheet">Marksheet</option>
                    </select>
                  </div>

                  {/* Tutor Selection }
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Assign Tutor</label>
                    <select
                      className="form-select"
                      value={selectedTutor}
                      onChange={(e) => setSelectedTutor(e.target.value)}
                      required
                    >
                      {tutors.map((t) => (
                        <option key={t._id} value={t.name}>
                          {t.name} ({t.department} - {t.year} {t.section})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reason }
                  {showReasonField && (
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">Reason</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required={showReasonField}
                        placeholder="Explain why you need this..."
                      />
                    </div>
                  )}

                  {/* Dates }
                  {showDateFields && (
                    <>
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-muted">Number of Days</label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          value={numDays}
                          onChange={(e) => setNumDays(e.target.value)}
                          required
                        />
                      </div>

                      {showSingleDate && (
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            required
                          />
                        </div>
                      )}

                      {showMultiDate && (
                        <div className="row mb-3">
                          <div className="col-6">
                            <label className="form-label small fw-bold text-muted">From</label>
                            <input
                              type="date"
                              className="form-control"
                              value={fromDate}
                              onChange={(e) => setFromDate(e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-6">
                            <label className="form-label small fw-bold text-muted">To</label>
                            <input
                              type="text"
                              className="form-control bg-light"
                              value={
                                fromDate
                                  ? formatDate(
                                      new Date(
                                        new Date(fromDate).getTime() +
                                          (parseInt(numDays) - 1) * 86400000
                                      )
                                    )
                                  : "Auto-calculated"
                              }
                              disabled
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* File Upload }
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Attachment (Optional)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setDocument(e.target.files[0])}
                    />
                  </div>

                  {/* Submit Button }
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      <i className="bi bi-send-fill me-2"></i>
                    )}
                    Submit Request
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ===== MY REQUESTS TABLE (Right) ===== }
          <div className="col-md-7">
            <div className="card h-100 border-0 shadow">
              <div className="card-header bg-transparent border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold text-primary mb-0">
                    <i className="bi bi-list-ul me-2"></i>History
                  </h4>
                  <p className="text-muted small mb-0">Track your request status</p>
                </div>
              </div>
              
              <div className="card-body">
                {requests.length === 0 ? (
                  <div className="empty-state h-100 d-flex flex-column justify-content-center">
                    <i className="bi bi-inbox"></i>
                    <h5 className="fw-bold text-muted">No requests yet</h5>
                    <p className="small">Use the form to submit your first request.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table custom-table align-middle">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Doc</th>
                          <th>Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((req) => (
                          <tr key={req._id}>
                            <td>
                              <span className="badge rounded-pill bg-light text-dark border fw-bold">
                                {req.requestType}
                              </span>
                            </td>
                            <td className="text-nowrap small text-muted">
                              {getDateDisplay(req)}
                            </td>
                            <td>
                              <span className={`badge rounded-pill fw-bold ${getStatusBadge(req.status)}`}>
                                {getStatusText(req.status)}
                              </span>
                            </td>
                            <td>
                              {req.document ? (
                                <a
                                  href={`http://localhost:5000/${req.document}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-sm btn-outline-primary rounded-circle"
                                  style={{width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                                >
                                  <i className="bi bi-eye-fill"></i>
                                </a>
                              ) : (
                                <span className="text-muted small">-</span>
                              )}
                            </td>
                            <td className="small text-truncate" style={{ maxWidth: '120px' }}>
                              {req.tutorComment && (
                                <div className="text-info mb-1">
                                  <small><strong>T:</strong> {req.tutorComment}</small>
                                </div>
                              )}
                              {req.hodComment && (
                                <div className="text-primary">
                                  <small><strong>H:</strong> {req.hodComment}</small>
                                </div>
                              )}
                              {!req.tutorComment && !req.hodComment && <span className="text-muted">-</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default StudentDashboard;*/

import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function StudentDashboard() {
  const studentName = localStorage.getItem("name") || "";
  const token = localStorage.getItem("token");

  // Form state
  const [requestType, setRequestType] = useState("");
  const [reason, setReason] = useState("");
  const [numDays, setNumDays] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [document, setDocument] = useState(null);
  const [attendance, setAttendance] = useState(""); // ✅ ADDED: Attendance State

  // Data state
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchTutors();
    fetchMyRequests();
  }, []);

  const fetchTutors = async () => {
    try {
      const res = await API.get("/tutors");
      setTutors(res.data);
      if (res.data.length > 0) {
        setSelectedTutor(res.data[0].name);
      }
    } catch (err) {
      console.error("Error fetching tutors:", err);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const res = await API.get("/requests/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  // Dynamic form logic
  const showDateFields = requestType === "OD" || requestType === "Leave";
  const showReasonField = requestType !== "Marksheet";
  const showMultiDate = showDateFields && parseInt(numDays) > 1;
  const showSingleDate = showDateFields && parseInt(numDays) === 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("tutorName", selectedTutor);
      formData.append("requestType", requestType);
      formData.append("reason", reason);
      formData.append("numDays", numDays);
      formData.append("fromDate", fromDate);
      formData.append("attendance", attendance); // ✅ ADDED: Append Attendance

      if (document) {
        formData.append("document", document);
      }

      await API.post("/requests", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Request submitted successfully!");

      // Reset form
      setRequestType("");
      setReason("");
      setNumDays(1);
      setFromDate("");
      setAttendance(""); // ✅ ADDED: Reset Attendance
      setDocument(null);
      e.target.reset();

      fetchMyRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  // Status badge colors
  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-warning text-dark",
      tutor_approved: "bg-info text-dark",
      tutor_rejected: "bg-danger",
      hod_approved: "bg-success",
      hod_rejected: "bg-secondary"
    };
    return badges[status] || "bg-secondary";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Pending",
      tutor_approved: "Tutor Approved",
      tutor_rejected: "Tutor Rejected",
      hod_approved: "HOD Approved",
      hod_rejected: "HOD Rejected"
    };
    return texts[status] || status;
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getDateDisplay = (req) => {
    if (req.requestType === "Marksheet") return "N/A";
    if (req.numDays === 1) return formatDate(req.date);
    return `${formatDate(req.fromDate)} → ${formatDate(req.toDate)}`;
  };

  return (
    <>
      <Navbar />
      
      {/* ========================
          COLORFUL STATS BAR
          ======================== */}
      <div className="container-fluid mb-4" style={{ marginTop: '20px' }}>
        <div className="row g-3 px-4">
          
          {/* Total Requests */}
          <div className="col-md-4">
            <div className="stat-card shadow-sm border-0">
              <div>
                <h6 className="text-muted text-uppercase mb-1" style={{fontSize: '0.75rem', fontWeight: '700'}}>Total Requests</h6>
                <h2 className="fw-bold mb-0">{requests.length}</h2>
              </div>
              <div className="stat-icon">
                <i className="bi bi-file-earmark-text"></i>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="col-md-4">
            <div className="stat-card shadow-sm border-0">
              <div>
                <h6 className="text-muted text-uppercase mb-1" style={{fontSize: '0.75rem', fontWeight: '700'}}>Pending</h6>
                <h2 className="fw-bold mb-0 text-warning">
                  {requests.filter(r => r.status === 'pending').length}
                </h2>
              </div>
              <div className="stat-icon bg-warning">
                <i className="bi bi-clock-history text-white"></i>
              </div>
            </div>
          </div>

          {/* Approved */}
          <div className="col-md-4">
            <div className="stat-card shadow-sm border-0">
              <div>
                <h6 className="text-muted text-uppercase mb-1" style={{fontSize: '0.75rem', fontWeight: '700'}}>Approved</h6>
                <h2 className="fw-bold mb-0 text-success">
                  {requests.filter(r => r.status === 'hod_approved' || r.status === 'tutor_approved').length}
                </h2>
              </div>
              <div className="stat-icon bg-success">
                <i className="bi bi-check-circle-fill text-white"></i>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================
          MAIN DASHBOARD CONTENT
          ======================== */}
      <div className="container mt-2 pb-5">
        <div className="row g-4">
          
          {/* ===== REQUEST FORM (Left) ===== */}
          <div className="col-md-5">
            <div className="card h-100 border-0 shadow">
              <div className="card-header bg-transparent border-0 pt-4 pb-0">
                <h4 className="fw-bold text-primary mb-0">
                  <i className="bi bi-plus-circle-fill me-2"></i>New Request
                </h4>
                <p className="text-muted small">Submit a new leave or OD request</p>
              </div>
              <div className="card-body pt-3">
                <form onSubmit={handleSubmit}>

                  {/* Request Type */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Request Type</label>
                    <select
                      className="form-select"
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      required
                    >
                      <option value="">-- Select Type --</option>
                      <option value="OD">OD (On Duty)</option>
                      <option value="Leave">Leave</option>
                      <option value="Bonafide">Bonafide Certificate</option>
                      <option value="Marksheet">Marksheet</option>
                    </select>
                  </div>

                  {/* Tutor Selection */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Assign Tutor</label>
                    <select
                      className="form-select"
                      value={selectedTutor}
                      onChange={(e) => setSelectedTutor(e.target.value)}
                      required
                    >
                      {tutors.map((t) => (
                        <option key={t._id} value={t.name}>
                          {t.name} ({t.department} - {t.year} {t.section})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reason */}
                  {showReasonField && (
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">Reason</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required={showReasonField}
                        placeholder="Explain why you need this..."
                      />
                    </div>
                  )}

                  {/* Dates & Attendance Container */}
                  {showDateFields && (
                    <>
                      {/* ✅ ADDED: Attendance Input */}
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-muted">Attendance %</label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            max="100"
                            value={attendance}
                            onChange={(e) => setAttendance(e.target.value)}
                            required
                            placeholder="e.g. 85"
                          />
                          <span className="input-group-text fw-bold text-muted">%</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-bold text-muted">Number of Days</label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          value={numDays}
                          onChange={(e) => setNumDays(e.target.value)}
                          required
                        />
                      </div>

                      {showSingleDate && (
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            required
                          />
                        </div>
                      )}

                      {showMultiDate && (
                        <div className="row mb-3">
                          <div className="col-6">
                            <label className="form-label small fw-bold text-muted">From</label>
                            <input
                              type="date"
                              className="form-control"
                              value={fromDate}
                              onChange={(e) => setFromDate(e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-6">
                            <label className="form-label small fw-bold text-muted">To</label>
                            <input
                              type="text"
                              className="form-control bg-light"
                              value={
                                fromDate
                                  ? formatDate(
                                      new Date(
                                        new Date(fromDate).getTime() +
                                          (parseInt(numDays) - 1) * 86400000
                                      )
                                    )
                                  : "Auto-calculated"
                              }
                              disabled
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* File Upload */}
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Attachment (Optional)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setDocument(e.target.files[0])}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      <i className="bi bi-send-fill me-2"></i>
                    )}
                    Submit Request
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ===== MY REQUESTS TABLE (Right) ===== */}
          <div className="col-md-7">
            <div className="card h-100 border-0 shadow">
              <div className="card-header bg-transparent border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold text-primary mb-0">
                    <i className="bi bi-list-ul me-2"></i>History
                  </h4>
                  <p className="text-muted small mb-0">Track your request status</p>
                </div>
              </div>
              
              <div className="card-body">
                {requests.length === 0 ? (
                  <div className="empty-state h-100 d-flex flex-column justify-content-center">
                    <i className="bi bi-inbox"></i>
                    <h5 className="fw-bold text-muted">No requests yet</h5>
                    <p className="small">Use the form to submit your first request.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table custom-table align-middle">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Att %</th> {/* ✅ ADDED Column */}
                          <th>Date</th>
                          <th>Status</th>
                          <th>Doc</th>
                          <th>Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((req) => (
                          <tr key={req._id}>
                            <td>
                              <span className="badge rounded-pill bg-light text-dark border fw-bold">
                                {req.requestType}
                              </span>
                            </td>
                            {/* ✅ ADDED: Attendance Display in Table */}
                            <td>
                              {req.attendance || req.attendance === 0 ? (
                                <span className={`badge rounded-pill fw-bold ${req.attendance < 75 ? 'bg-danger' : 'bg-success'}`}>
                                  {req.attendance}%
                                </span>
                              ) : (
                                <span className="text-muted small">-</span>
                              )}
                            </td>
                            <td className="text-nowrap small text-muted">
                              {getDateDisplay(req)}
                            </td>
                            <td>
                              <span className={`badge rounded-pill fw-bold ${getStatusBadge(req.status)}`}>
                                {getStatusText(req.status)}
                              </span>
                            </td>
                            <td>
                              {req.document ? (
                                <a
                                  href={`http://localhost:5000/${req.document}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-sm btn-outline-primary rounded-circle"
                                  style={{width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                                >
                                  <i className="bi bi-eye-fill"></i>
                                </a>
                              ) : (
                                <span className="text-muted small">-</span>
                              )}
                            </td>
                            <td className="small text-truncate" style={{ maxWidth: '120px' }}>
                              {req.tutorComment && (
                                <div className="text-info mb-1">
                                  <small><strong>T:</strong> {req.tutorComment}</small>
                                </div>
                              )}
                              {req.hodComment && (
                                <div className="text-primary">
                                  <small><strong>H:</strong> {req.hodComment}</small>
                                </div>
                              )}
                              {!req.tutorComment && !req.hodComment && <span className="text-muted">-</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default StudentDashboard;

