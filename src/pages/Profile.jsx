import { useState } from "react";
import {
  BriefcaseBusiness,
  MapPin,
  Mail,
  Pencil,
  UserRound,
  Target,
  Code2,
  FileText,
  Settings,
  ArrowRight,
  Bookmark,
  CalendarDays,
  X,
  Plus,
} from "lucide-react";

import { Link } from "react-router-dom";


const defaultCareerProfile = {
  role: "",
  location: "",
  experience: "",
  lookingFor: "",
  workMode: "",
  preferredLocation: "",
  skills: [],
};


function Profile({
  applications = [],
  interviews = [],
  savedJobs = [],
  userSession,
}) {

  // =========================================
  // USER INFORMATION
  // =========================================

  const userName =
    userSession?.name || "HireFlow User";

  const userEmail =
    userSession?.email || "No email available";

  const firstName =
    userName.trim().split(" ")[0];

  const userInitial =
    userName
      .trim()
      .charAt(0)
      .toUpperCase();


  // =========================================
  // CAREER PROFILE
  // =========================================

  const [careerProfile, setCareerProfile] =
    useState(() => {

      const savedProfile =
        localStorage.getItem(
          "hireflowCareerProfile"
        );

      return savedProfile
        ? JSON.parse(savedProfile)
        : defaultCareerProfile;

    });


  // =========================================
  // EDIT PROFILE
  // =========================================

  const [editOpen, setEditOpen] =
    useState(false);

  const [editProfile, setEditProfile] =
    useState(careerProfile);

  const [skillInput, setSkillInput] =
    useState("");


  const openEditProfile = () => {

    setEditProfile(careerProfile);

    setSkillInput("");

    setEditOpen(true);

  };


  const closeEditProfile = () => {

    setEditProfile(careerProfile);

    setSkillInput("");

    setEditOpen(false);

  };


  const handleProfileChange = (event) => {

    const { name, value } =
      event.target;

    setEditProfile(
      (previousProfile) => ({
        ...previousProfile,
        [name]: value,
      })
    );

  };


  // =========================================
  // SKILLS
  // =========================================

  const addSkill = () => {

    const newSkill =
      skillInput.trim();

    if (!newSkill) {
      return;
    }


    const skillAlreadyExists =
      editProfile.skills.some(
        (skill) =>
          skill.toLowerCase() ===
          newSkill.toLowerCase()
      );


    if (skillAlreadyExists) {

      setSkillInput("");

      return;

    }


    setEditProfile(
      (previousProfile) => ({
        ...previousProfile,

        skills: [
          ...previousProfile.skills,
          newSkill,
        ],
      })
    );


    setSkillInput("");

  };


  const removeSkill = (
    skillToRemove
  ) => {

    setEditProfile(
      (previousProfile) => ({

        ...previousProfile,

        skills:
          previousProfile.skills.filter(
            (skill) =>
              skill !== skillToRemove
          ),

      })
    );

  };


  const handleSkillKeyDown = (
    event
  ) => {

    if (event.key === "Enter") {

      event.preventDefault();

      addSkill();

    }

  };


  // =========================================
  // SAVE PROFILE
  // =========================================

  const saveProfile = (
    event
  ) => {

    event.preventDefault();


    localStorage.setItem(
      "hireflowCareerProfile",
      JSON.stringify(editProfile)
    );


    setCareerProfile(editProfile);

    setEditOpen(false);

  };


  // =========================================
  // PROFILE COMPLETION
  // =========================================

  const profileFields = [

    careerProfile.role,

    careerProfile.location,

    careerProfile.experience,

    careerProfile.lookingFor,

    careerProfile.workMode,

    careerProfile.preferredLocation,

    careerProfile.skills.length > 0,

  ];


  const completedFields =
    profileFields.filter(Boolean).length;


  const profileCompletion =
    Math.round(
      (
        completedFields /
        profileFields.length
      ) * 100
    );


  // =========================================
  // REAL JOB SEARCH STATISTICS
  // =========================================

  const applicationCount =
    applications.length;


  const interviewCount =
    interviews.filter(
      (interview) =>
        !interview.completed
    ).length;


  const savedJobsCount =
    savedJobs.length;


  return (

    <section className="profile-page">


      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <header className="profile-page-header">

        <div>

          <span className="profile-eyebrow">
            MY HIREFLOW
          </span>

          <h1>
            My Profile
          </h1>

          <p>
            Manage your career profile and
            job-search preferences.
          </p>

        </div>


        <div className="profile-header-user">

          <div className="profile-header-avatar">
            {userInitial}
          </div>

          <div>

            <strong>
              Hi, {firstName}!
            </strong>

            <span>
              Career profile
            </span>

          </div>

        </div>

      </header>



      {/* =====================================
          PROFILE HERO
      ===================================== */}

      <section className="profile-hero-card">

        <div className="profile-avatar-large">
          {userInitial}
        </div>


        <div className="profile-main-information">

          <span className="profile-status">
            ● Open to opportunities
          </span>

          <h2>
            {userName}
          </h2>


          <div className="profile-role">

            <BriefcaseBusiness
              size={17}
            />

            <span>
              {careerProfile.role ||
                "Add your current role"}
            </span>

          </div>


          <div className="profile-location">

            <MapPin size={16} />

            <span>
              {careerProfile.location ||
                "Add your location"}
            </span>

          </div>


          <div className="profile-email">

            <Mail size={16} />

            <span>
              {userEmail}
            </span>

          </div>

        </div>


        <button
          type="button"
          className="profile-edit-button"
          onClick={openEditProfile}
        >

          <Pencil size={16} />

          Edit Profile

        </button>

      </section>



      {/* =====================================
          PROFILE COMPLETION
      ===================================== */}

      <section className="profile-completion-card">

        <div className="profile-completion-heading">

          <div>

            <span>
              PROFILE STRENGTH
            </span>

            <h3>
              Your career profile
            </h3>

          </div>


          <strong>
            {profileCompletion}%
          </strong>

        </div>


        <div className="profile-progress-track">

          <div
            className="profile-progress-value"
            style={{
              width:
                `${profileCompletion}%`,
            }}
          />

        </div>


        <p>

          {profileCompletion === 100
            ? "Great! Your HireFlow career profile is complete."
            : "Complete your career details to strengthen your HireFlow profile."}

        </p>

      </section>



      {/* =====================================
          DETAILS
      ===================================== */}

      <div className="profile-details-grid">


        {/* CAREER DETAILS */}

        <section className="profile-info-card">

          <div className="profile-card-heading">

            <div className="profile-card-icon">
              <UserRound size={20} />
            </div>

            <div>

              <h2>
                Career Details
              </h2>

              <p>
                Your professional information
              </p>

            </div>

          </div>


          <div className="profile-detail-row">

            <span>
              Current Role
            </span>

            <strong>
              {careerProfile.role ||
                "Not added"}
            </strong>

          </div>


          <div className="profile-detail-row">

            <span>
              Experience Level
            </span>

            <strong>
              {careerProfile.experience ||
                "Not added"}
            </strong>

          </div>


          <div className="profile-skills-section">

            <span className="profile-field-label">
              Skills
            </span>


            <div className="profile-skill-list">

              {careerProfile.skills.length >
              0 ? (

                careerProfile.skills.map(
                  (skill) => (

                    <span
                      className="profile-skill"
                      key={skill}
                    >
                      {skill}
                    </span>

                  )
                )

              ) : (

                <span className="profile-empty-value">
                  No skills added yet.
                </span>

              )}

            </div>

          </div>

        </section>



        {/* JOB SEARCH PREFERENCES */}

        <section className="profile-info-card">

          <div className="profile-card-heading">

            <div className="profile-card-icon">
              <Target size={20} />
            </div>

            <div>

              <h2>
                Job Search Preferences
              </h2>

              <p>
                What you're looking for
              </p>

            </div>

          </div>


          <div className="profile-detail-row">

            <span>
              Looking For
            </span>

            <strong>
              {careerProfile.lookingFor ||
                "Not added"}
            </strong>

          </div>


          <div className="profile-detail-row">

            <span>
              Work Mode
            </span>

            <strong>
              {careerProfile.workMode ||
                "Not added"}
            </strong>

          </div>


          <div className="profile-detail-row">

            <span>
              Preferred Location
            </span>

            <strong>
              {careerProfile.preferredLocation ||
                "Not added"}
            </strong>

          </div>

        </section>



        {/* JOB SEARCH */}

        <section className="profile-info-card">

          <div className="profile-card-heading">

            <div className="profile-card-icon">

              <BriefcaseBusiness
                size={20}
              />

            </div>

            <div>

              <h2>
                My Job Search
              </h2>

              <p>
                Your HireFlow activity
              </p>

            </div>

          </div>


          <div className="profile-stat-list">


            <div className="profile-stat">

              <div className="profile-stat-icon">

                <FileText size={18} />

              </div>

              <div>

                <strong>
                  {applicationCount}
                </strong>

                <span>
                  Applications
                </span>

              </div>

            </div>


            <div className="profile-stat">

              <div className="profile-stat-icon">

                <CalendarDays
                  size={18}
                />

              </div>

              <div>

                <strong>
                  {interviewCount}
                </strong>

                <span>
                  Interviews
                </span>

              </div>

            </div>


            <div className="profile-stat">

              <div className="profile-stat-icon">

                <Bookmark size={18} />

              </div>

              <div>

                <strong>
                  {savedJobsCount}
                </strong>

                <span>
                  Saved Jobs
                </span>

              </div>

            </div>

          </div>

        </section>



        {/* ACCOUNT */}

        <section className="profile-info-card">

          <div className="profile-card-heading">

            <div className="profile-card-icon">
              <Settings size={20} />
            </div>

            <div>

              <h2>
                Account
              </h2>

              <p>
                Your HireFlow account
              </p>

            </div>

          </div>


          <div className="profile-account-email">

            <span>
              Email Address
            </span>

            <strong>
              {userEmail}
            </strong>

          </div>


          <div className="profile-account-note">

            <Code2 size={18} />

            <p>
              Your account keeps your job
              search organized across
              HireFlow.
            </p>

          </div>


          <Link
            to="/settings"
            className="profile-settings-link"
          >

            Account Settings

            <ArrowRight size={17} />

          </Link>

        </section>

      </div>



      {/* =====================================
          EDIT PROFILE MODAL
      ===================================== */}

      {editOpen && (

        <div
          className="profile-modal-backdrop"
          onMouseDown={closeEditProfile}
        >

          <div
            className="profile-edit-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="profile-modal-header">

              <div>

                <span>
                  CAREER PROFILE
                </span>

                <h2>
                  Edit Profile
                </h2>

                <p>
                  Update your professional
                  details and job preferences.
                </p>

              </div>


              <button
                type="button"
                className="profile-modal-close"
                onClick={closeEditProfile}
                aria-label="Close edit profile"
              >

                <X size={20} />

              </button>

            </div>



            {/* FORM */}

            <form
              className="profile-edit-form"
              onSubmit={saveProfile}
            >


              <div className="profile-form-grid">


                <div className="profile-form-field">

                  <label htmlFor="profileRole">
                    Current Role
                  </label>

                  <input
                    id="profileRole"
                    type="text"
                    name="role"
                    placeholder="Frontend Developer"
                    value={editProfile.role}
                    onChange={
                      handleProfileChange
                    }
                  />

                </div>


                <div className="profile-form-field">

                  <label htmlFor="profileLocation">
                    Current Location
                  </label>

                  <input
                    id="profileLocation"
                    type="text"
                    name="location"
                    placeholder="City, Country"
                    value={
                      editProfile.location
                    }
                    onChange={
                      handleProfileChange
                    }
                  />

                </div>


                <div className="profile-form-field">

                  <label htmlFor="profileExperience">
                    Experience Level
                  </label>

                  <select
                    id="profileExperience"
                    name="experience"
                    value={
                      editProfile.experience
                    }
                    onChange={
                      handleProfileChange
                    }
                  >

                    <option value="">
                      Select experience
                    </option>

                    <option value="Fresher">
                      Fresher
                    </option>

                    <option value="0 - 1 Year">
                      0 - 1 Year
                    </option>

                    <option value="1 - 3 Years">
                      1 - 3 Years
                    </option>

                    <option value="3 - 5 Years">
                      3 - 5 Years
                    </option>

                    <option value="5+ Years">
                      5+ Years
                    </option>

                  </select>

                </div>


                <div className="profile-form-field">

                  <label htmlFor="profileLookingFor">
                    Looking For
                  </label>

                  <input
                    id="profileLookingFor"
                    type="text"
                    name="lookingFor"
                    placeholder="Frontend Developer"
                    value={
                      editProfile.lookingFor
                    }
                    onChange={
                      handleProfileChange
                    }
                  />

                </div>


                <div className="profile-form-field">

                  <label htmlFor="profileWorkMode">
                    Preferred Work Mode
                  </label>

                  <select
                    id="profileWorkMode"
                    name="workMode"
                    value={
                      editProfile.workMode
                    }
                    onChange={
                      handleProfileChange
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

                    <option value="Remote / Hybrid">
                      Remote / Hybrid
                    </option>

                  </select>

                </div>


                <div className="profile-form-field">

                  <label htmlFor="profilePreferredLocation">
                    Preferred Location
                  </label>

                  <input
                    id="profilePreferredLocation"
                    type="text"
                    name="preferredLocation"
                    placeholder="Bangalore, Remote..."
                    value={
                      editProfile.preferredLocation
                    }
                    onChange={
                      handleProfileChange
                    }
                  />

                </div>

              </div>



              {/* SKILLS */}

              <div className="profile-form-field profile-skills-editor">

                <label>
                  Skills
                </label>


                <div className="profile-add-skill">

                  <input
                    type="text"
                    placeholder="Type a skill and press Enter"
                    value={skillInput}
                    onChange={(event) =>
                      setSkillInput(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleSkillKeyDown
                    }
                  />


                  <button
                    type="button"
                    onClick={addSkill}
                  >

                    <Plus size={16} />

                    Add

                  </button>

                </div>


                {editProfile.skills.length >
                  0 && (

                  <div className="profile-edit-skill-list">

                    {editProfile.skills.map(
                      (skill) => (

                        <span key={skill}>

                          {skill}

                          <button
                            type="button"
                            onClick={() =>
                              removeSkill(skill)
                            }
                            aria-label={
                              `Remove ${skill}`
                            }
                          >
                            ×
                          </button>

                        </span>

                      )
                    )}

                  </div>

                )}

              </div>



              {/* ACTIONS */}

              <div className="profile-modal-actions">

                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={closeEditProfile}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="profile-save-button"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </section>

  );

}


export default Profile;