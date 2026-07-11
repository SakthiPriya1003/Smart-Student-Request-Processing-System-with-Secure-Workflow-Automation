import { Link } from "react-router-dom";

function Navbar() {

  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("name");

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <nav className="navbar navbar-light navbar-custom sticky-top">
      <div className="container-fluid">
        
        {/* Brand Logo */}
        <span className="navbar-brand">
          <i className="bi bi-grid-1x2-fill me-2 text-primary"></i>
          <span className="fw-bold text-dark">SmartRequest</span>
        </span>

        <div className="d-flex align-items-center">
          
          {/* Role Badges (Visual Indicators) */}
          {role === "student" && (
            <span className="badge rounded-pill bg-info text-white me-2 shadow-sm border border-2 border-white d-none d-md-block" style={{padding: '8px 16px', fontSize: '0.8rem'}}>
              <i className="bi bi-mortarboard-fill me-1"></i>Student
            </span>
          )}
          {role === "tutor" && (
            <span className="badge rounded-pill bg-success text-white me-2 shadow-sm border border-2 border-white d-none d-md-block" style={{padding: '8px 16px', fontSize: '0.8rem'}}>
              <i className="bi bi-person-workspace me-1"></i>Tutor
            </span>
          )}
          {role === "hod" && (
            <span className="badge rounded-pill bg-danger text-white me-2 shadow-sm border border-2 border-white d-none d-md-block" style={{padding: '8px 16px', fontSize: '0.8rem'}}>
              <i className="bi bi-building me-1"></i>HOD
            </span>
          )}

          {/* Profile Dropdown */}
          <div className="dropdown">
            <button 
              className="btn btn-light rounded-circle shadow-sm" 
              type="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              style={{width: '42px', height: '42px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
              <i className="bi bi-person-fill fs-5 text-primary"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{minWidth: '200px'}}>
              <li>
                <div className="dropdown-header text-center fw-bold text-primary">
                  {userName}
                </div>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger fw-medium" onClick={logout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </nav>
  );
}
export default Navbar;