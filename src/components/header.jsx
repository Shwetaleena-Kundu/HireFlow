import {
  Search,
  Bell,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";


function Header({ userSession }) {

  const navigate = useNavigate();


  // =========================================
  // USER INFORMATION
  // =========================================

  const firstName =
    userSession?.name
      ?.trim()
      .split(" ")[0];

  const userInitial =
    userSession?.name
      ?.trim()
      .charAt(0)
      .toUpperCase();


  return (

    <header className="dashboard-header">


      {/* =====================================
          WELCOME
      ===================================== */}

      <div className="welcome-text">

        <h1>
          {userSession
            ? `Hello, ${firstName}!`
            : "Welcome to HireFlow!"}
        </h1>

        <p>
          Here's what’s happening with
          your job search.
        </p>

      </div>


      {/* =====================================
          HEADER ACTIONS
      ===================================== */}

      <div className="header-actions">


        {/* SEARCH */}

        <div className="header-search-box">

          <Search size={20} />

          <input
            type="search"
            placeholder="Search applications, jobs..."
          />

        </div>


        {/* NOTIFICATIONS */}

        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
        >

          <Bell size={22} />

          <span className="notification-dot" />

        </button>


        {/* =====================================
            USER / AUTH
        ===================================== */}

        {userSession ? (

          <button
            type="button"
            className="profile-button"
            aria-label="Open profile"
            title="My Profile"
            onClick={() =>
              navigate("/profile")
            }
          >

            {userInitial}

          </button>

        ) : (

          <div className="header-auth-actions">

            <Link
              to="/register"
              className="header-register-btn"
            >
              Register
            </Link>

            <Link
              to="/login"
              className="header-login-btn"
            >
              Login
            </Link>

          </div>

        )}

      </div>

    </header>

  );

}


export default Header;