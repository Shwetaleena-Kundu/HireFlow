import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import "./App.css";
import "./application.css";
import "./jobboard.css";
import "./interviews.css";
import "./Analytics.css";
import "./savedjobs.css";
import "./responsive.css";
import "./jobdetails.css";
import "./profile.css";
import "./settings.css";

import Sidebar from "./components/sidebar.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Applications from "./pages/Applications.jsx";
import JobBoard from "./pages/jobboard.jsx";
import Interviews from "./pages/Interviews.jsx";
import Analytics from "./pages/Analytics.jsx";
import SavedJobs from "./pages/Savedjobs.jsx";
import JobDetails from "./pages/jobdetails.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";

const initialApplications = [];


function App() {

  const location = useLocation();


  // =========================================
  // AUTH PAGE CHECK
  // =========================================

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";


  // =========================================
  // USER SESSION
  // =========================================

  const [userSession, setUserSession] =
    useState(() => {

      const savedSession =
        localStorage.getItem(
          "hireflowSession"
        );

      return savedSession
        ? JSON.parse(savedSession)
        : null;

    });


  // =========================================
  // SAVED JOBS
  // =========================================

  const [savedJobs, setSavedJobs] =
    useState(() => {

      const saved =
        localStorage.getItem(
          "hireflowSavedJobs"
        );

      return saved
        ? JSON.parse(saved)
        : [];

    });


  // =========================================
  // APPLICATIONS
  // =========================================

  const [applications, setApplications] =
    useState(() => {

      const savedApplications =
        localStorage.getItem(
          "hireflowApplications"
        );

      return savedApplications
        ? JSON.parse(savedApplications)
        : initialApplications;

    });


  // =========================================
  // INTERVIEWS
  // =========================================

  const [interviews, setInterviews] =
    useState(() => {

      const savedInterviews =
        localStorage.getItem(
          "hireflowInterviews"
        );

      return savedInterviews
        ? JSON.parse(savedInterviews)
        : [];

    });


  // =========================================
  // LOCAL STORAGE
  // =========================================

  useEffect(() => {

    localStorage.setItem(
      "hireflowSavedJobs",
      JSON.stringify(savedJobs)
    );

  }, [savedJobs]);


  useEffect(() => {

    localStorage.setItem(
      "hireflowApplications",
      JSON.stringify(applications)
    );

  }, [applications]);


  useEffect(() => {

    localStorage.setItem(
      "hireflowInterviews",
      JSON.stringify(interviews)
    );

  }, [interviews]);


  return (

    <main
      className={
        isAuthPage
          ? "auth-layout"
          : "app-layout"
      }
    >


      {/* =====================================
          SIDEBAR
      ===================================== */}

      {!isAuthPage && (

        <Sidebar
          userSession={userSession}
          setUserSession={setUserSession}
        />

      )}



      {/* =====================================
          ROUTES
      ===================================== */}

      <Routes>


        {/* DASHBOARD */}

        <Route
          path="/"
          element={
            <Dashboard
              applications={applications}
              savedJobs={savedJobs}
              interviews={interviews}
              userSession={userSession}
            />
          }
        />



        {/* APPLICATIONS */}

        <Route
          path="/applications"
          element={
            <Applications
              applications={applications}
              setApplications={
                setApplications
              }
            />
          }
        />



        {/* JOB BOARD */}

        <Route
          path="/job-board"
          element={
            <JobBoard
              savedJobs={savedJobs}
              setSavedJobs={setSavedJobs}
              applications={applications}
              setApplications={
                setApplications
              }
            />
          }
        />



        {/* INTERVIEWS */}

        <Route
          path="/interviews"
          element={
            <Interviews
              applications={applications}
              setApplications={
                setApplications
              }
              interviews={interviews}
              setInterviews={
                setInterviews
              }
              userSession={userSession}
            />
          }
        />



        {/* ANALYTICS */}

        <Route
          path="/analytics"
          element={
            <Analytics
              applications={applications}
              interviews={interviews}
              userSession={userSession}
            />
          }
        />



        {/* SAVED JOBS */}

        <Route
          path="/saved-jobs"
          element={
            <SavedJobs
              savedJobs={savedJobs}
              setSavedJobs={setSavedJobs}
            />
          }
        />



        {/* PROFILE */}

        <Route
          path="/profile"
          element={
            <Profile
              applications={applications}
              interviews={interviews}
              savedJobs={savedJobs}
              userSession={userSession}
            />
          }
        />



        {/* JOB DETAILS */}

        <Route
          path="/job-details/:slug"
          element={
            <JobDetails
              savedJobs={savedJobs}
            />
          }
        />



        {/* REGISTER */}

        <Route
          path="/register"
          element={<Register />}
        />



        {/* LOGIN */}

        <Route
          path="/login"
          element={
            <Login
              setUserSession={
                setUserSession
              }
            />
          }
        />
        <Route
          path="/settings"
          element={
            <Settings
              userSession={userSession}
              setUserSession={setUserSession}
            />
          }
        />


      </Routes>

    </main>

  );

}


export default App;