// client/src/pages/TutorDashboard.js
/*import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function TutorDashboard() {
  const tutorName = localStorage.getItem("name") || "";
  const token = localStorage.getItem("token");

  const [requests, setRequests] = useState([]);
  const [comment, setComment] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/tutors/requests", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const handleDecision = async (id, status) => {
    try {
      await API.put(
        `/tutors/requests/${id}`,
        { status, comment },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setComment("");
      setSelectedId(null);
      fetchRequests();
      alert(`Request ${status === "tutor_approved" ? "approved" : "rejected"}!`);
    } catch (err) {
      alert("Failed to update request");
    }
  };

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

  const getHeaderColor = (type) => {
    const colors = {
      OD: "bg-primary",
      Leave: "bg-warning text-dark",
      Bonafide: "bg-success",
      Marksheet: "bg-info text-dark"
    };
    return colors[type] || "bg-secondary";
  };

  // FILTER REQUESTS INTO 3 GROUPS
  const pendingRequests = requests.filter(r => r.status === "pending");
  const approvedRequests = requests.filter(r => r.status === "tutor_approved" || r.status === "hod_approved");
  const rejectedRequests = requests.filter(r => r.status === "tutor_rejected");

  // COMPONENT TO RENDER A REQUEST CARD
  const RequestCard = ({ req, isPending }) => (
    <div className="col-md-6 mb-3">
      <div className="card shadow-sm h-100">
        <div className={`card-header text-white d-flex justify-content-between align-items-center ${getHeaderColor(req.requestType)}`}>
          <span className="badge bg-white text-dark fw-bold">
            {req.requestType}
          </span>
          <span className="badge bg-white bg-opacity-25">
            {req.status === "tutor_approved" ? "Approved" : 
             req.status === "tutor_rejected" ? "Rejected" : "Pending"}
          </span>
        </div>
        <div className="card-body">
          <h6 className="card-title fw-bold">{req.studentName}</h6>
          
          <div className="mb-2">
            <strong className="small text-muted">Reason:</strong>
            <p className="mb-1">{req.reason || "N/A"}</p>
          </div>

          <div className="mb-2">
            <strong className="small text-muted">Dates:</strong> <span className="fw-medium">{getDateDisplay(req)}</span>
          </div>

          {req.document && (
            <div className="mb-3">
              <strong className="small text-muted">Document:</strong>
              <a
                href={`http://localhost:5000/${req.document}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-primary ms-2"
              >
                <i className="bi bi-file-earmark-pdf me-1"></i>View
              </a>
            </div>
          )}

          {/* Comment Input - Only for Pending }
          {isPending && (
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Add Comment:</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Optional comment..."
                value={selectedId === req._id ? comment : ""}
                onChange={(e) => {
                  setSelectedId(req._id);
                  setComment(e.target.value);
                }}
              />
            </div>
          )}

          {/* ACTION AREA }
          {isPending ? (
            <div className="d-flex gap-2">
              <button
                className="btn btn-success btn-sm flex-grow-1"
                onClick={() => handleDecision(req._id, "tutor_approved")}
              >
                <i className="bi bi-check-lg me-1"></i>Approve
              </button>
              <button
                className="btn btn-danger btn-sm flex-grow-1"
                onClick={() => handleDecision(req._id, "tutor_rejected")}
              >
                <i className="bi bi-x-lg me-1"></i>Reject
              </button>
            </div>
          ) : (
            <div className="alert alert-light border small py-2 text-center mb-0">
              {req.tutorComment ? `Comment: "${req.tutorComment}"` : "Processed with no comment"}
            </div>
          )}
        </div>
        <div className="card-footer text-muted small bg-transparent">
          Applied: {formatDate(req.createdAt)}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        
        {/* SECTION 1: PENDING REQUESTS }
        <div className="mb-5">
          <h5 className="fw-bold text-primary mb-3">
            <i className="bi bi-hourglass-split me-2"></i>Pending Requests 
            <span className="badge bg-warning text-dark rounded-pill ms-2">{pendingRequests.length}</span>
          </h5>
          {pendingRequests.length === 0 ? (
            <div className="alert alert-light border text-center py-4 text-muted">
              No pending requests to review.
            </div>
          ) : (
            <div className="row">
              {pendingRequests.map(req => <RequestCard key={req._id} req={req} isPending={true} />)}
            </div>
          )}
        </div>

        {/* SECTION 2: APPROVED HISTORY }
        <div className="mb-5">
          <h5 className="fw-bold text-success mb-3">
            <i className="bi bi-check-circle-fill me-2"></i>Approved History 
            <span className="badge bg-success text-white rounded-pill ms-2">{approvedRequests.length}</span>
          </h5>
          {approvedRequests.length === 0 ? (
            <div className="alert alert-light border text-center py-4 text-muted">
              No approved requests yet.
            </div>
          ) : (
            <div className="row">
              {approvedRequests.map(req => <RequestCard key={req._id} req={req} isPending={false} />)}
            </div>
          )}
        </div>

        {/* SECTION 3: REJECTED HISTORY }
        <div className="mb-5">
          <h5 className="fw-bold text-danger mb-3">
            <i className="bi bi-x-circle-fill me-2"></i>Rejected History 
            <span className="badge bg-danger text-white rounded-pill ms-2">{rejectedRequests.length}</span>
          </h5>
          {rejectedRequests.length === 0 ? (
            <div className="alert alert-light border text-center py-4 text-muted">
              No rejected requests yet.
            </div>
          ) : (
            <div className="row">
              {rejectedRequests.map(req => <RequestCard key={req._id} req={req} isPending={false} />)}
            </div>
          )}
        </div>

      </div>
    </>
  );
}

export default TutorDashboard;*/

import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function TutorDashboard() {
  const tutorName = localStorage.getItem("name") || "";
  const token = localStorage.getItem("token");

  const [requests, setRequests] = useState([]);
  const [comment, setComment] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/tutors/requests", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const handleDecision = async (id, status) => {
    try {
      await API.put(
        `/tutors/requests/${id}`,
        { status, comment },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setComment("");
      setSelectedId(null);
      fetchRequests();
      alert(`Request ${status === "tutor_approved" ? "approved" : "rejected"}!`);
    } catch (err) {
      alert("Failed to update request");
    }
  };

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

  const getHeaderColor = (type) => {
    const colors = {
      OD: "bg-primary",
      Leave: "bg-warning text-dark",
      Bonafide: "bg-success",
      Marksheet: "bg-info text-dark"
    };
    return colors[type] || "bg-secondary";
  };

  // FILTER REQUESTS INTO 3 GROUPS
  const pendingRequests = requests.filter(r => r.status === "pending");
  const approvedRequests = requests.filter(r => r.status === "tutor_approved" || r.status === "hod_approved");
  const rejectedRequests = requests.filter(r => r.status === "tutor_rejected");

  // COMPONENT TO RENDER A REQUEST CARD
  const RequestCard = ({ req, isPending }) => (
    <div className="col-md-6 mb-3">
      <div className="card shadow-sm h-100">
        <div className={`card-header text-white d-flex justify-content-between align-items-center ${getHeaderColor(req.requestType)}`}>
          <span className="badge bg-white text-dark fw-bold">
            {req.requestType}
          </span>
          <span className="badge bg-white bg-opacity-25">
            {req.status === "tutor_approved" ? "Approved" : 
             req.status === "tutor_rejected" ? "Rejected" : "Pending"}
          </span>
        </div>
        <div className="card-body">
          <h6 className="card-title fw-bold">{req.studentName}</h6>
          
          <div className="mb-2">
            <strong className="small text-muted">Reason:</strong>
            <p className="mb-1">{req.reason || "N/A"}</p>
          </div>

          {/* ✅ ADDED: Attendance Display */}
          <div className="mb-2">
            <strong className="small text-muted">Attendance:</strong>{" "}
            {req.attendance || req.attendance === 0 ? (
              <span className={`badge rounded-pill fw-bold ms-1 ${req.attendance < 75 ? 'bg-danger' : 'bg-success'}`}>
                {req.attendance}%
              </span>
            ) : (
              <span className="text-muted">N/A</span>
            )}
          </div>

          <div className="mb-2">
            <strong className="small text-muted">Dates:</strong> <span className="fw-medium">{getDateDisplay(req)}</span>
          </div>

          {req.document && (
            <div className="mb-3">
              <strong className="small text-muted">Document:</strong>
              <a
                href={`http://localhost:5000/${req.document}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-primary ms-2"
              >
                <i className="bi bi-file-earmark-pdf me-1"></i>View
              </a>
            </div>
          )}

          {/* Comment Input - Only for Pending */}
          {isPending && (
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Add Comment:</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Optional comment..."
                value={selectedId === req._id ? comment : ""}
                onChange={(e) => {
                  setSelectedId(req._id);
                  setComment(e.target.value);
                }}
              />
            </div>
          )}

          {/* ACTION AREA */}
          {isPending ? (
            <div className="d-flex gap-2">
              <button
                className="btn btn-success btn-sm flex-grow-1"
                onClick={() => handleDecision(req._id, "tutor_approved")}
              >
                <i className="bi bi-check-lg me-1"></i>Approve
              </button>
              <button
                className="btn btn-danger btn-sm flex-grow-1"
                onClick={() => handleDecision(req._id, "tutor_rejected")}
              >
                <i className="bi bi-x-lg me-1"></i>Reject
              </button>
            </div>
          ) : (
            <div className="alert alert-light border small py-2 text-center mb-0">
              {req.tutorComment ? `Comment: "${req.tutorComment}"` : "Processed with no comment"}
            </div>
          )}
        </div>
        <div className="card-footer text-muted small bg-transparent">
          Applied: {formatDate(req.createdAt)}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        
        {/* SECTION 1: PENDING REQUESTS */}
        <div className="mb-5">
          <h5 className="fw-bold text-primary mb-3">
            <i className="bi bi-hourglass-split me-2"></i>Pending Requests 
            <span className="badge bg-warning text-dark rounded-pill ms-2">{pendingRequests.length}</span>
          </h5>
          {pendingRequests.length === 0 ? (
            <div className="alert alert-light border text-center py-4 text-muted">
              No pending requests to review.
            </div>
          ) : (
            <div className="row">
              {pendingRequests.map(req => <RequestCard key={req._id} req={req} isPending={true} />)}
            </div>
          )}
        </div>

        {/* SECTION 2: APPROVED HISTORY */}
        <div className="mb-5">
          <h5 className="fw-bold text-success mb-3">
            <i className="bi bi-check-circle-fill me-2"></i>Approved History 
            <span className="badge bg-success text-white rounded-pill ms-2">{approvedRequests.length}</span>
          </h5>
          {approvedRequests.length === 0 ? (
            <div className="alert alert-light border text-center py-4 text-muted">
              No approved requests yet.
            </div>
          ) : (
            <div className="row">
              {approvedRequests.map(req => <RequestCard key={req._id} req={req} isPending={false} />)}
            </div>
          )}
        </div>

        {/* SECTION 3: REJECTED HISTORY */}
        <div className="mb-5">
          <h5 className="fw-bold text-danger mb-3">
            <i className="bi bi-x-circle-fill me-2"></i>Rejected History 
            <span className="badge bg-danger text-white rounded-pill ms-2">{rejectedRequests.length}</span>
          </h5>
          {rejectedRequests.length === 0 ? (
            <div className="alert alert-light border text-center py-4 text-muted">
              No rejected requests yet.
            </div>
          ) : (
            <div className="row">
              {rejectedRequests.map(req => <RequestCard key={req._id} req={req} isPending={false} />)}
            </div>
          )}
        </div>

      </div>
    </>
  );
}

export default TutorDashboard;