import { useState } from "react";
import {
  User,
  Bell,
  BriefcaseBusiness,
  Sun,
  AlertTriangle,
  LogOut,
  Trash2,
} from "lucide-react";

function Settings({
  userSession,
  setUserSession,
}) {
  const [activeTab, setActiveTab] =
    useState("account");

  const [notifications, setNotifications] =
    useState({
      interviewReminders: true,
      applicationUpdates: true,
      savedJobReminders: false,
      weeklySummary: true,
    });

  const [preferences, setPreferences] =
    useState({
      role: "",
      workMode: "",
      location: "",
      jobType: "",
    });

  const [theme, setTheme] =
    useState("system");

  const [compactDashboard, setCompactDashboard] =
    useState(false);

  const [showClearModal, setShowClearModal] =
    useState(false);


  const handleNotificationToggle = (name) => {
    setNotifications((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };


  const handlePreferenceChange = (event) => {
    const { name, value } = event.target;

    setPreferences((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const saveSettings = () => {
    const settings = {
      notifications,
      preferences,
      theme,
      compactDashboard,
    };

    localStorage.setItem(
      "hireflowSettings",
      JSON.stringify(settings)
    );
  };


  const handleLogout = () => {
    localStorage.removeItem(
      "hireflowSession"
    );

    setUserSession(null);
  };


  const clearAllHireFlowData = () => {
    localStorage.removeItem(
      "hireflowApplications"
    );

    localStorage.removeItem(
      "hireflowSavedJobs"
    );

    localStorage.removeItem(
      "hireflowInterviews"
    );

    localStorage.removeItem(
      "hireflowCareerProfile"
    );

    localStorage.removeItem(
      "hireflowSettings"
    );

    setShowClearModal(false);

    window.location.reload();
  };


  return (
    <section className="settings-page">

      <header className="settings-header">
        <span>HIREFLOW SETTINGS</span>

        <h1>Settings</h1>

        <p>
          Manage your account and HireFlow
          preferences.
        </p>
      </header>


      <div className="settings-layout">


        {/* LEFT MENU */}

        <aside className="settings-menu">

          <button
            className={
              activeTab === "account"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("account")
            }
          >
            <User size={18} />
            Account
          </button>


          <button
            className={
              activeTab === "notifications"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("notifications")
            }
          >
            <Bell size={18} />
            Notifications
          </button>


          <button
            className={
              activeTab === "preferences"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("preferences")
            }
          >
            <BriefcaseBusiness size={18} />
            Job Preferences
          </button>


          <button
            className={
              activeTab === "appearance"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("appearance")
            }
          >
            <Sun size={18} />
            Appearance
          </button>


          <button
            className={
              activeTab === "danger"
                ? "active danger"
                : "danger"
            }
            onClick={() =>
              setActiveTab("danger")
            }
          >
            <AlertTriangle size={18} />
            Danger Zone
          </button>

        </aside>



        {/* RIGHT CONTENT */}

        <div className="settings-content">


          {/* ACCOUNT */}

          {activeTab === "account" && (
            <div className="settings-card">

              <div className="settings-card-heading">
                <h2>Account Settings</h2>

                <p>
                  Update your account information.
                </p>
              </div>


              <div className="settings-form">

                <div className="settings-field">
                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={
                      userSession?.name || ""
                    }
                    readOnly
                  />
                </div>


                <div className="settings-field">
                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={
                      userSession?.email || ""
                    }
                    readOnly
                  />
                </div>


                <div className="settings-field">
                  <label>
                    Current Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>


                <div className="settings-field">
                  <label>
                    New Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>


                <div className="settings-field">
                  <label>
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>


                <button
                  className="settings-save-button"
                  onClick={saveSettings}
                >
                  Save Changes
                </button>

              </div>

            </div>
          )}



          {/* NOTIFICATIONS */}

          {activeTab === "notifications" && (
            <div className="settings-card">

              <div className="settings-card-heading">
                <h2>
                  Notification Preferences
                </h2>

                <p>
                  Choose which updates you want
                  to receive.
                </p>
              </div>


              <div className="settings-toggle-list">

                <ToggleRow
                  title="Interview reminders"
                  description="Get notified before your interviews."
                  checked={
                    notifications.interviewReminders
                  }
                  onChange={() =>
                    handleNotificationToggle(
                      "interviewReminders"
                    )
                  }
                />


                <ToggleRow
                  title="Application updates"
                  description="Status changes and responses."
                  checked={
                    notifications.applicationUpdates
                  }
                  onChange={() =>
                    handleNotificationToggle(
                      "applicationUpdates"
                    )
                  }
                />


                <ToggleRow
                  title="Saved job reminders"
                  description="Remind me about saved jobs."
                  checked={
                    notifications.savedJobReminders
                  }
                  onChange={() =>
                    handleNotificationToggle(
                      "savedJobReminders"
                    )
                  }
                />


                <ToggleRow
                  title="Weekly job-search summary"
                  description="A recap of your job-search activity."
                  checked={
                    notifications.weeklySummary
                  }
                  onChange={() =>
                    handleNotificationToggle(
                      "weeklySummary"
                    )
                  }
                />


                <button
                  className="settings-save-button"
                  onClick={saveSettings}
                >
                  Save Preferences
                </button>

              </div>

            </div>
          )}



          {/* JOB PREFERENCES */}

          {activeTab === "preferences" && (
            <div className="settings-card">

              <div className="settings-card-heading">
                <h2>
                  Job Preferences
                </h2>

                <p>
                  Help HireFlow personalize your
                  job search.
                </p>
              </div>


              <div className="settings-form">

                <div className="settings-field">
                  <label>
                    Preferred Role
                  </label>

                  <input
                    type="text"
                    name="role"
                    value={
                      preferences.role
                    }
                    onChange={
                      handlePreferenceChange
                    }
                    placeholder="Frontend Developer"
                  />
                </div>


                <div className="settings-field">
                  <label>
                    Work Mode
                  </label>

                  <select
                    name="workMode"
                    value={
                      preferences.workMode
                    }
                    onChange={
                      handlePreferenceChange
                    }
                  >
                    <option value="">
                      Select work mode
                    </option>

                    <option value="Remote">
                      Remote
                    </option>

                    <option value="Hybrid">
                      Hybrid
                    </option>

                    <option value="On-site">
                      On-site
                    </option>
                  </select>
                </div>


                <div className="settings-field">
                  <label>
                    Preferred Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={
                      preferences.location
                    }
                    onChange={
                      handlePreferenceChange
                    }
                    placeholder="Bhubaneswar"
                  />
                </div>


                <div className="settings-field">
                  <label>
                    Job Type
                  </label>

                  <select
                    name="jobType"
                    value={
                      preferences.jobType
                    }
                    onChange={
                      handlePreferenceChange
                    }
                  >
                    <option value="">
                      Select job type
                    </option>

                    <option value="Full-time">
                      Full-time
                    </option>

                    <option value="Internship">
                      Internship
                    </option>

                    <option value="Contract">
                      Contract
                    </option>
                  </select>
                </div>


                <button
                  className="settings-save-button"
                  onClick={saveSettings}
                >
                  Save Preferences
                </button>

              </div>

            </div>
          )}



          {/* APPEARANCE */}

          {activeTab === "appearance" && (
            <div className="settings-card">

              <div className="settings-card-heading">
                <h2>
                  Appearance Settings
                </h2>

                <p>
                  Customize how HireFlow looks.
                </p>
              </div>


              <div className="theme-options">

                {[
                  "light",
                  "dark",
                  "system",
                ].map((option) => (

                  <button
                    key={option}
                    className={
                      theme === option
                        ? "theme-option active"
                        : "theme-option"
                    }
                    onClick={() =>
                      setTheme(option)
                    }
                  >
                    {option}
                  </button>

                ))}

              </div>


              <ToggleRow
                title="Compact dashboard"
                description="Show more content in less space."
                checked={
                  compactDashboard
                }
                onChange={() =>
                  setCompactDashboard(
                    (current) => !current
                  )
                }
              />


              <button
                className="settings-save-button"
                onClick={saveSettings}
              >
                Save Preferences
              </button>

            </div>
          )}



          {/* DANGER ZONE */}

          {activeTab === "danger" && (
            <div className="settings-card">

              <div className="settings-card-heading danger-heading">
                <h2>
                  Danger Zone
                </h2>

                <p>
                  These actions affect your
                  HireFlow account.
                </p>
              </div>


              <div className="danger-action">

                <div>
                  <LogOut size={20} />

                  <div>
                    <strong>
                      Log out
                    </strong>

                    <p>
                      Sign out of HireFlow on this
                      device.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                >
                  Log Out
                </button>

              </div>


              <div className="danger-action">

                <div>
                  <Trash2 size={20} />

                  <div>
                    <strong>
                      Clear HireFlow data
                    </strong>

                    <p>
                      Delete your local applications,
                      saved jobs, interviews and
                      career data.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setShowClearModal(true)
                  }
                >
                  Clear All Data
                </button>

              </div>

            </div>
          )}

        </div>

      </div>



      {/* CLEAR DATA MODAL */}

      {showClearModal && (

        <div className="settings-modal-backdrop">

          <div className="settings-modal">

            <Trash2 size={28} />

            <h2>
              Clear all HireFlow data?
            </h2>

            <p>
              This will permanently remove your
              applications, saved jobs, interviews
              and career information from this
              browser.
            </p>


            <div className="settings-modal-actions">

              <button
                className="cancel"
                onClick={() =>
                  setShowClearModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="clear"
                onClick={
                  clearAllHireFlowData
                }
              >
                Clear Data
              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}


function ToggleRow({
  title,
  description,
  checked,
  onChange,
}) {
  return (

    <div className="settings-toggle-row">

      <div>
        <strong>
          {title}
        </strong>

        <p>
          {description}
        </p>
      </div>


      <button
        type="button"
        className={
          checked
            ? "settings-toggle active"
            : "settings-toggle"
        }
        onClick={onChange}
      >
        <span />
      </button>

    </div>

  );
}


export default Settings;