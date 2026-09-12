import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import {
  LayoutDashboard,
  FileText,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";


function Sidebar({
  userSession,
  setUserSession,
}) {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const navigate =
    useNavigate();


  // =========================================
  // USER INITIAL
  // =========================================

  const userInitial =
    userSession?.name
      ?.trim()
      .charAt(0)
      .toUpperCase();


  // =========================================
  // NAVIGATION LINKS
  // =========================================

  const navigationLinks = [

    {
      name: "Dashboard",
      path: "/",
      icon:
        <LayoutDashboard size={21} />,
    },

    {
      name: "Applications",
      path: "/applications",
      icon:
        <FileText size={21} />,
    },

    {
      name: "Job Board",
      path: "/job-board",
      icon:
        <BriefcaseBusiness size={21} />,
    },

    {
      name: "Interviews",
      path: "/interviews",
      icon:
        <CalendarDays size={21} />,
    },

    {
      name: "Analytics",
      path: "/analytics",
      icon:
        <ChartNoAxesCombined size={21} />,
    },

    {
      name: "Saved Jobs",
      path: "/saved-jobs",
      icon:
        <Heart size={21} />,
    },

  ];


  // =========================================
  // CLOSE MOBILE MENU
  // =========================================

  const closeMenu = () => {

    setMenuOpen(false);

  };


  // =========================================
  // OPEN PROFILE
  // =========================================

  const openProfile = () => {

    closeMenu();

    navigate("/profile");

  };


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    // Remove ONLY login session
    localStorage.removeItem(
      "hireflowSession"
    );


    // Update React immediately
    setUserSession(null);


    // Close mobile sidebar
    closeMenu();


    // Go back to dashboard
    navigate("/");

  };


  return (

    <>

      <aside
        className={
          menuOpen
            ? "sidebar mobile-menu-open"
            : "sidebar"
        }
      >

        <div className="sidebar-main">


          {/* =================================
              MOBILE HEADER
          ================================= */}

          <div className="sidebar-mobile-header">


            {/* MENU BUTTON */}

            <button
              type="button"
              className="mobile-menu-button"
              onClick={() =>
                setMenuOpen(
                  (current) => !current
                )
              }
              aria-label={
                menuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={menuOpen}
            >

              {menuOpen
                ? <X size={22} />
                : <Menu size={22} />
              }

            </button>



            {/* LOGO */}

            <div className="sidebar-logo">

              <h2>
                HireFlow
              </h2>

              <p>
                Track. Apply. Grow.
              </p>

            </div>



            {/* MOBILE ACTIONS */}

            <div className="mobile-sidebar-actions">


              {/* NOTIFICATION */}

              <button
                type="button"
                className="mobile-notification"
                aria-label="Notifications"
              >

                <Bell size={19} />

                <span className="mobile-notification-dot" />

              </button>



              {/* PROFILE */}

              {userSession && (

                <button
                  type="button"
                  className="mobile-avatar"
                  aria-label="Open profile"
                  title="My Profile"
                  onClick={openProfile}
                >

                  {userInitial}

                </button>

              )}

            </div>

          </div>



          {/* =================================
              NAVIGATION
          ================================= */}

          <nav className="sidebar-nav">

            {navigationLinks.map(
              (link) => (

                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({
                    isActive,
                  }) =>
                    isActive
                      ? "nav-link active"
                      : "nav-link"
                  }
                  onClick={closeMenu}
                  end={
                    link.path === "/"
                  }
                >

                  {link.icon}

                  <span>
                    {link.name}
                  </span>

                </NavLink>

              )
            )}

          </nav>

        </div>



        {/* =================================
            SIDEBAR BOTTOM
        ================================= */}

        <div className="sidebar-bottom">


          {/* SETTINGS */}

          <NavLink
            to="/settings"
            className="nav-link"
            onClick={closeMenu}
          >

            <Settings size={21} />

            <span>
              Settings
            </span>

          </NavLink>



          {/* LOGOUT */}

          {userSession && (

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >

              <LogOut size={21} />

              <span>
                Logout
              </span>

            </button>

          )}

        </div>

      </aside>



      {/* =================================
          MOBILE BACKDROP
      ================================= */}

      {menuOpen && (

        <button
          type="button"
          className="mobile-menu-backdrop"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        />

      )}

    </>

  );

}


export default Sidebar;