import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Clock3,
  ExternalLink,
  Lightbulb,
  MapPin,
  Search,
  Sparkles,
  Target,
} from "lucide-react";

import heroImage from "../assets/job-board-hero.png";


const categories = [
  "All Jobs",
  "Frontend",
  "React",
  "UI/UX",
  "Remote",
  "Internships",
  "Full-time",
  "Part-time",
  "Data",
  "Design",
  "Product",
  "Marketing",
];

const newJobTabs = [
  "All", "Remote", "Internships", "Full-time", "Part-time",
];

const preferenceRoles = [
  "Frontend Developer", "React Developer", "UI/UX Designer",
  "Web Designer", "Product Designer", "Data Analyst",
  "Backend Developer", "Full Stack Developer", "Marketing",
];

const workPreferences = ["Remote", "Hybrid", "On-site"];


function cleanDescription(html = "") {
  if (!html) return "";

  const firstPass = new DOMParser()
    .parseFromString(html, "text/html")
    .documentElement.textContent || "";

  const secondPass = new DOMParser()
    .parseFromString(firstPass, "text/html")
    .body.textContent || firstPass;

  return secondPass.replace(/\s+/g, " ").trim();
}


function JobBoard({ savedJobs, setSavedJobs, applications, setApplications }) {
  // ---------------- API DATA ----------------
  const [jobs, setJobs] = useState([]);

  // ---------------- DETAILS PANEL ----------------
  const [selectedJob, setSelectedJob] = useState(null);

  // ---------------- SEARCH / FILTERS ----------------
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Anywhere");
  const [activeCategory, setActiveCategory] = useState("All Jobs");

  // ---------------- SECTION CONTROLS ----------------
  const [showAllRecommended, setShowAllRecommended] = useState(false);
  const [showAllNewJobs, setShowAllNewJobs] = useState(false);
  const [newJobsTab, setNewJobsTab] = useState("All");

  // ---------------- RECOMMENDATION PREFERENCES ----------------
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferredRoles, setPreferredRoles] = useState([]);
  const [preferredWorkModes, setPreferredWorkModes] = useState([]);
  const [draftRoles, setDraftRoles] = useState([]);
  const [draftWorkModes, setDraftWorkModes] = useState([]);


  // ====================================================
  // FETCH REAL JOBS FROM ARBEITNOW API
  // ====================================================

  useEffect(() => {
    fetch("https://www.arbeitnow.com/api/job-board-api")
      .then((response) => response.json())
      .then((data) => {
        setJobs(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);


  // ====================================================
  // SAVE / UNSAVE
  // ====================================================

  const toggleSaveJob = (job) => {
    const alreadySaved = savedJobs.some(
      (savedJob) => savedJob.slug === job.slug
    );

    if (alreadySaved) {
      setSavedJobs(
        savedJobs.filter(
          (savedJob) => savedJob.slug !== job.slug
        )
      );
    } else {
      setSavedJobs([...savedJobs, job]);
    }
  };


  // ====================================================
  // ADD REAL API JOB TO APPLICATIONS
  // ====================================================

  const applyToJob = (job) => {
    const alreadyApplied = applications.some(
      (application) => application.slug === job.slug
    );

    if (alreadyApplied) {
      window.alert("You already added this job to Applications.");
      return;
    }

    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const application = {
      id: `${job.slug}-${Date.now()}`,
      slug: job.slug,
      company: job.company_name || "Company not listed",
      role: job.title || "Job title not listed",
      location: job.remote
        ? "Remote"
        : job.location || "Location not listed",
      type: job.job_types?.[0] || "Job type not listed",
      mode: job.remote ? "Remote" : "On-site",
      status: "Applied",
      appliedDate: today,
      nextAction: "Waiting for response",
      nextDate: "",
      logo: "",
      url: job.url || "",
    };

    setApplications((currentApplications) => [
      application,
      ...currentApplications,
    ]);

    window.alert("Job added to Applications.");
  };


  // ====================================================
  // LOCATION OPTIONS FROM REAL API DATA
  // ====================================================

  const locationOptions = useMemo(() => {
    const uniqueLocations = [
      ...new Set(
        jobs
          .map((job) => job.location)
          .filter(Boolean)
          .map((location) => location.trim())
      ),
    ]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    return uniqueLocations.slice(0, 30);
  }, [jobs]);


  // ====================================================
  // FILTER HELPERS
  // ====================================================

  const getSearchableText = (job) => {
    return [
      job.title,
      job.company_name,
      job.location,
      ...(job.tags || []),
      ...(job.job_types || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  };


  const matchesCategory = (job, category) => {
    const text = getSearchableText(job);
    const jobTypes = (job.job_types || [])
      .join(" ")
      .toLowerCase();

    switch (category) {
      case "Frontend":
        return (
          text.includes("frontend") ||
          text.includes("front-end") ||
          text.includes("react") ||
          text.includes("javascript") ||
          text.includes("web developer")
        );

      case "React":
        return text.includes("react");

      case "UI/UX":
        return (
          text.includes("ui") ||
          text.includes("ux") ||
          text.includes("user interface") ||
          text.includes("user experience")
        );

      case "Remote":
        return job.remote === true || text.includes("remote");

      case "Internships":
        return (
          jobTypes.includes("intern") ||
          text.includes("internship") ||
          text.includes("intern")
        );

      case "Full-time":
        return (
          jobTypes.includes("full") ||
          text.includes("full-time") ||
          text.includes("full time")
        );

      case "Part-time":
        return (
          jobTypes.includes("part") ||
          text.includes("part-time") ||
          text.includes("part time")
        );

      case "Data":
        return (
          text.includes("data") ||
          text.includes("analytics") ||
          text.includes("machine learning")
        );

      case "Design":
        return (
          text.includes("design") ||
          text.includes("designer") ||
          text.includes("ui") ||
          text.includes("ux")
        );

      case "Product":
        return (
          text.includes("product") ||
          text.includes("product manager")
        );

      case "Marketing":
        return (
          text.includes("marketing") ||
          text.includes("seo") ||
          text.includes("content")
        );

      default:
        return true;
    }
  };


  const matchesNewJobsTab = (job, tab) => {
    if (tab === "All") return true;

    if (tab === "Remote") {
      return job.remote === true ||
        getSearchableText(job).includes("remote");
    }

    return matchesCategory(job, tab);
  };


  // ====================================================
  // RECOMMENDATION PREFERENCES
  // ====================================================

  const matchesPreferredRole = (job, role) => {
    const text = getSearchableText(job);

    const roleWords = {
      "Frontend Developer": ["frontend", "front-end", "javascript", "web developer"],
      "React Developer": ["react"],
      "UI/UX Designer": ["ui", "ux", "user interface", "user experience"],
      "Web Designer": ["web design", "web designer", "website design"],
      "Product Designer": ["product design", "product designer"],
      "Data Analyst": ["data analyst", "analytics", "business intelligence"],
      "Backend Developer": ["backend", "back-end", "node", "golang", "java developer"],
      "Full Stack Developer": ["full stack", "full-stack", "fullstack"],
      "Marketing": ["marketing", "seo", "content"],
    };

    return (roleWords[role] || []).some((word) => text.includes(word));
  };

  const matchesPreferredWorkMode = (job, mode) => {
    const text = getSearchableText(job);
    if (mode === "Remote") return job.remote === true || text.includes("remote");
    if (mode === "Hybrid") return text.includes("hybrid");
    if (mode === "On-site") {
      return text.includes("on-site") || text.includes("onsite") || text.includes("on site");
    }
    return true;
  };

  const openPreferences = () => {
    setDraftRoles(preferredRoles);
    setDraftWorkModes(preferredWorkModes);
    setShowPreferences(true);
  };

  const toggleDraftRole = (role) => {
    setDraftRoles((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role]
    );
  };

  const toggleDraftWorkMode = (mode) => {
    setDraftWorkModes((current) =>
      current.includes(mode)
        ? current.filter((item) => item !== mode)
        : [...current, mode]
    );
  };

  const savePreferences = () => {
    setPreferredRoles(draftRoles);
    setPreferredWorkModes(draftWorkModes);
    setShowAllRecommended(false);
    setSelectedJob(null);
    setShowPreferences(false);
  };


  // ====================================================
  // FILTERED API JOBS
  // ====================================================

  const filteredJobs = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase();

    return jobs.filter((job) => {
      const searchableText = getSearchableText(job);

      const matchesSearch =
        !normalizedQuery ||
        searchableText.includes(normalizedQuery);

      const matchesLocation =
        selectedLocation === "Anywhere" ||
        (selectedLocation === "Remote"
          ? job.remote === true
          : (job.location || "")
              .toLowerCase()
              .includes(selectedLocation.toLowerCase()));

      const matchesSelectedCategory =
        matchesCategory(job, activeCategory);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesSelectedCategory
      );
    });
  }, [
    jobs,
    searchQuery,
    selectedLocation,
    activeCategory,
  ]);


  const hasPreferences =
    preferredRoles.length > 0 || preferredWorkModes.length > 0;

  const preferenceMatchedJobs = useMemo(() => {
    if (!hasPreferences) return filteredJobs;

    return filteredJobs.filter((job) => {
      const roleMatches =
        preferredRoles.length === 0 ||
        preferredRoles.some((role) => matchesPreferredRole(job, role));

      const workModeMatches =
        preferredWorkModes.length === 0 ||
        preferredWorkModes.some((mode) => matchesPreferredWorkMode(job, mode));

      return roleMatches && workModeMatches;
    });
  }, [filteredJobs, preferredRoles, preferredWorkModes, hasPreferences]);

  const recommendedLimit = showAllRecommended ? 20 : 4;

  const recommendedJobs =
    preferenceMatchedJobs.slice(0, recommendedLimit);

  const recommendedSlugs = new Set(
    recommendedJobs.map((job) => job.slug)
  );

  const newSectionBaseJobs =
    filteredJobs.filter((job) => !recommendedSlugs.has(job.slug));

  const newSectionFilteredJobs =
    newSectionBaseJobs.filter(
      (job) => matchesNewJobsTab(job, newJobsTab)
    );

  const visibleNewJobs = showAllNewJobs
    ? newSectionFilteredJobs.slice(0, 20)
    : newSectionFilteredJobs.slice(0, 5);


  // ====================================================
  // SEARCH
  // ====================================================

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
    setShowAllRecommended(false);
    setShowAllNewJobs(false);
    setSelectedJob(null);
  };


  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setShowAllRecommended(false);
    setShowAllNewJobs(false);
    setSelectedJob(null);
  };


  return (
    <section
      className={`jb-page ${
        selectedJob ? "details-open" : ""
      }`}
    >

      {/* =================================================
          LEFT SIDE
      ================================================= */}

      <main className="jb-main">

        {/* HERO */}

        <section
          className="jb-hero"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="jb-hero-copy">
            <h1>
              Find a Job
              <br />
              that <span>Fits You</span>
            </h1>

            <p>
              Search. Explore. Get Hired.
            </p>
          </div>
        </section>


        {/* =================================================
            SEARCH
        ================================================= */}

        <form
          className="jb-search-panel"
          onSubmit={handleSearch}
        >

          <label className="jb-search-field">
            <Search size={21} />

            <input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder="Search jobs, companies or keywords (e.g. Frontend, React, Remote)"
            />
          </label>


          <div className="jb-location-wrap">
            <MapPin size={18} />

            <select
              className="jb-location"
              value={selectedLocation}
              onChange={(event) => {
                setSelectedLocation(event.target.value);
                setShowAllRecommended(false);
                setShowAllNewJobs(false);
                setSelectedJob(null);
              }}
            >
              <option value="Anywhere">
                Anywhere
              </option>

              <option value="Remote">
                Remote
              </option>

              {locationOptions.map((location) => (
                <option
                  value={location}
                  key={location}
                >
                  {location}
                </option>
              ))}
            </select>
          </div>


          <button
            className="jb-primary"
            type="submit"
          >
            Search
          </button>

        </form>


        {/* =================================================
            CATEGORIES
        ================================================= */}

        <div className="jb-categories">

          {categories.map((item) => (
            <button
              className={
                activeCategory === item
                  ? "active"
                  : ""
              }
              key={item}
              onClick={() =>
                handleCategoryClick(item)
              }
            >
              {item}
            </button>
          ))}

          <button
            className="jb-round-button"
            aria-label="More job categories"
          >
            <ArrowRight size={17} />
          </button>

        </div>


        {/* FILTER RESULT SUMMARY */}

        {(searchQuery ||
          selectedLocation !== "Anywhere" ||
          activeCategory !== "All Jobs") && (
          <div className="jb-filter-summary">
            <strong>
              {filteredJobs.length}
            </strong>

            <span>
              jobs found
              {searchQuery
                ? ` for "${searchQuery}"`
                : ""}
            </span>

            <button
              onClick={() => {
                setSearchInput("");
                setSearchQuery("");
                setSelectedLocation("Anywhere");
                setActiveCategory("All Jobs");
                setSelectedJob(null);
              }}
            >
              Clear filters
            </button>
          </div>
        )}


        {/* =================================================
            PREFERENCES
        ================================================= */}

        <section className="jb-preferences">

          <div className="jb-preference-icon">
            <Target size={34} />
          </div>

          <div>
            <h3>
              Find opportunities that match your skills
            </h3>

            <p>
              Add your skills and get better job recommendations.
            </p>
          </div>

          <Sparkles
            className="jb-sparkles"
            size={27}
          />

          <button onClick={openPreferences}>
            Update Preferences
            <ArrowRight size={16} />
          </button>

        </section>


        {/* NO RESULTS */}

        {filteredJobs.length === 0 && (
          <div className="jb-no-results">
            <Search size={30} />

            <h3>
              No matching jobs found
            </h3>

            <p>
              Try another keyword, location or category.
            </p>
          </div>
        )}


        {/* =================================================
            RECOMMENDED JOBS
        ================================================= */}

        {filteredJobs.length > 0 && (
          <section className="jb-section">

            <header className="jb-section-heading">

              <div className="jb-title-wrap">
                <Lightbulb size={25} />

                <div>
                  <h2>
                    Recommended for You
                  </h2>

                  <p>
                    {hasPreferences
                      ? `${preferenceMatchedJobs.length} API jobs match your preferences.`
                      : "Real opportunities from the job API."}
                  </p>
                </div>
              </div>


              <button
                onClick={() =>
                  setShowAllRecommended(
                    (current) => !current
                  )
                }
              >
                {showAllRecommended
                  ? "Show less"
                  : "See all"}

                <ArrowRight size={15} />
              </button>

            </header>


            <div className="jb-card-grid">

              {recommendedJobs.map((job) => (

                <article
                  className="jb-job-card"
                  key={job.slug}
                >

                  <h3>
                    {job.title}
                  </h3>

                  <p className="jb-company">
                    {job.company_name}
                  </p>

                  <p className="jb-meta">
                    <MapPin size={14} />

                    {job.remote
                      ? "Remote"
                      : job.location ||
                        "Location not listed"}
                  </p>

                  <div className="jb-skills">
                    {job.tags
                      ?.slice(0, 3)
                      .map((tag) => (
                        <span key={tag}>
                          {tag}
                        </span>
                      ))}
                  </div>


                  <div className="jb-card-actions">

                    <button
                      className="jb-save-btn"
                      aria-label="Save job"
                      onClick={() =>
                        toggleSaveJob(job)
                      }
                    >
                      <Bookmark
                        size={14}
                        fill={
                          savedJobs.some(
                            (savedJob) =>
                              savedJob.slug === job.slug
                          )
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>


                    <button
                      className="jb-view-btn"
                      onClick={() =>
                        setSelectedJob(job)
                      }
                    >
                      View Details
                      <ArrowRight size={12} />
                    </button>

                  </div>

                </article>

              ))}

            </div>

          </section>
        )}


        {/* =================================================
            NEW THIS WEEK
        ================================================= */}

        {filteredJobs.length > recommendedLimit && (
          <section className="jb-section jb-new-section">

            <header className="jb-section-heading">

              <div className="jb-title-wrap">

                <span className="jb-fire">
                  🔥
                </span>

                <div>
                  <h2>
                    New This Week
                  </h2>

                  <p>
                    More live opportunities from the API.
                  </p>
                </div>

              </div>


              <div className="jb-mini-tabs">

                {newJobTabs.map((item) => (
                  <button
                    className={
                      newJobsTab === item
                        ? "active"
                        : ""
                    }
                    key={item}
                    onClick={() => {
                      setNewJobsTab(item);
                      setShowAllNewJobs(false);
                    }}
                  >
                    {item}
                  </button>
                ))}


                <button
                  className="jb-new-see-all"
                  onClick={() =>
                    setShowAllNewJobs(
                      (current) => !current
                    )
                  }
                >
                  {showAllNewJobs
                    ? "Show less"
                    : "See all"}

                  <ArrowRight size={15} />
                </button>

              </div>

            </header>


            <div className="jb-job-list">

              {visibleNewJobs.map((job) => (

                <div
                  className="jb-list-row"
                  key={job.slug}
                >

                  <div className="jb-logo is-small">
                    {job.company_name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>


                  <strong title={job.company_name}>
                    {job.company_name}
                  </strong>


                  <span
                    className="jb-list-role"
                    title={job.title}
                  >
                    {job.title}
                  </span>


                  <span
                    className={`jb-type ${
                      (job.job_types || [])
                        .join(" ")
                        .toLowerCase()
                        .includes("intern")
                        ? "internship"
                        : ""
                    }`}
                  >
                    {job.job_types?.[0] || "Job"}
                  </span>


                  <span className="jb-age">
                    <MapPin size={14} />

                    {job.remote
                      ? "Remote"
                      : job.location ||
                        "Not listed"}
                  </span>


                  <div className="jb-skills">
                    {job.tags
                      ?.slice(0, 3)
                      .map((tag) => (
                        <span key={tag}>
                          {tag}
                        </span>
                      ))}
                  </div>


                  <button
                    className="jb-save"
                    onClick={() =>
                      toggleSaveJob(job)
                    }
                    aria-label={
                      savedJobs.some(
                        (savedJob) =>
                          savedJob.slug === job.slug
                      )
                        ? "Unsave job"
                        : "Save job"
                    }
                  >
                    <Bookmark
                      size={17}
                      fill={
                        savedJobs.some(
                          (savedJob) =>
                            savedJob.slug === job.slug
                        )
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>


                  <button
                    className="jb-apply"
                    onClick={() =>
                      setSelectedJob(job)
                    }
                  >
                    Apply
                    <ArrowRight size={15} />
                  </button>

                </div>

              ))}

            </div>


            {visibleNewJobs.length === 0 && (
              <div className="jb-new-empty">
                No jobs match this New This Week filter.
              </div>
            )}

          </section>
        )}

      </main>


      {showPreferences && (
        <div
          className="jb-preference-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowPreferences(false);
          }}
        >
          <div className="jb-preference-modal" role="dialog" aria-modal="true">
            <div className="jb-preference-modal-head">
              <div>
                <span>Personalize HireFlow</span>
                <h2>What kind of jobs are you looking for?</h2>
                <p>Choose your preferred roles and work style. Recommended jobs will update from the live API.</p>
              </div>
              <button className="jb-preference-close" onClick={() => setShowPreferences(false)}>×</button>
            </div>

            <div className="jb-preference-group">
              <h3>Preferred roles</h3>
              <div className="jb-preference-options">
                {preferenceRoles.map((role) => (
                  <button
                    key={role}
                    className={draftRoles.includes(role) ? "selected" : ""}
                    onClick={() => toggleDraftRole(role)}
                  >
                    {role} {draftRoles.includes(role) && <b>✓</b>}
                  </button>
                ))}
              </div>
            </div>

            <div className="jb-preference-group">
              <h3>Work preference</h3>
              <div className="jb-preference-options">
                {workPreferences.map((mode) => (
                  <button
                    key={mode}
                    className={draftWorkModes.includes(mode) ? "selected" : ""}
                    onClick={() => toggleDraftWorkMode(mode)}
                  >
                    {mode} {draftWorkModes.includes(mode) && <b>✓</b>}
                  </button>
                ))}
              </div>
            </div>

            <div className="jb-preference-modal-footer">
              <button
                className="jb-preference-clear"
                onClick={() => {
                  setDraftRoles([]);
                  setDraftWorkModes([]);
                }}
              >
                Clear choices
              </button>

              <button className="jb-preference-save" onClick={savePreferences}>
                Save Preferences <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}


      {/* =================================================
          RIGHT DETAILS — ONLY EXISTS AFTER CLICK
      ================================================= */}

      {selectedJob && (
        <aside className="jb-details">

          <div className="jb-profile-bar">
            <Bell size={20} />

            <span className="jb-avatar">
              M
            </span>

            <div>
              <strong>
                Hi, Mana!
              </strong>

              <small>
                Keep going!
              </small>
            </div>

            <span>
              ⌄
            </span>
          </div>


          <div className="jb-details-body">

            <div className="jb-detail-nav">

              <button
                onClick={() =>
                  setSelectedJob(null)
                }
              >
                <ArrowLeft size={15} />
                Back to results
              </button>


              <div>
                <button
                  className="jb-external-job"
                  onClick={() =>
                    window.open(
                      selectedJob.url,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  aria-label="Open original job"
                >
                  <ExternalLink size={18} />
                </button>

                <button
                  className="jb-detail-close"
                  onClick={() =>
                    setSelectedJob(null)
                  }
                  aria-label="Close job details"
                >
                  ×
                </button>
              </div>

            </div>


            <div className="jb-job-title">

              <div className="jb-logo">
                {selectedJob.company_name
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h2>
                  {selectedJob.title}
                </h2>

                <p>
                  {selectedJob.company_name}
                </p>
              </div>

            </div>


            <p className="jb-detail-meta">
              <MapPin size={15} />

              {selectedJob.remote
                ? "Remote"
                : selectedJob.location ||
                  "Location not listed"}
            </p>


            <p className="jb-detail-meta">
              <BriefcaseBusiness size={15} />

              {selectedJob.job_types?.[0] ||
                "Job type not listed"}

              <Clock3 size={15} />

              Live job listing
            </p>


            <div className="jb-detail-actions">

              <button
                onClick={() =>
                  toggleSaveJob(selectedJob)
                }
              >
                <Bookmark
                  size={18}
                  fill={
                    savedJobs.some(
                      (savedJob) =>
                        savedJob.slug ===
                        selectedJob.slug
                    )
                      ? "currentColor"
                      : "none"
                  }
                />

                {savedJobs.some(
                  (savedJob) =>
                    savedJob.slug ===
                    selectedJob.slug
                )
                  ? "Saved"
                  : "Save"}
              </button>


              <button
                onClick={() => {
                  applyToJob(selectedJob);

                  if (selectedJob.url) {
                    window.open(
                      selectedJob.url,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }
                }}
              >
                {applications.some(
                  (application) =>
                    application.slug === selectedJob.slug
                )
                  ? "Applied"
                  : "Apply Now"}

                <ArrowRight size={17} />
              </button>

            </div>


            <div className="jb-detail-tabs">
              <button className="active">
                Overview
              </button>

              <button>
                Requirements
              </button>

              <button>
                Benefits
              </button>

              <button>
                Company
              </button>
            </div>


            <article className="jb-description">

              <h3>
                About the role
              </h3>

              <p>
                {cleanDescription(
                  selectedJob.description
                ).slice(0, 1200) ||
                  "No description available for this job."}
              </p>


              <h3>
                Skills / Categories
              </h3>

              <div className="jb-detail-skills">
                {selectedJob.tags
                  ?.slice(0, 7)
                  .map((tag) => (
                    <span key={tag}>
                      {tag}
                    </span>
                  ))}
              </div>

            </article>


            <div className="jb-match-note">
              <Lightbulb size={27} />

              <div>
                <strong>
                  Live opportunity
                </strong>

                <p>
                  Review the real job details before applying. 💜
                </p>
              </div>
            </div>


            <dl className="jb-facts">

              <div>
                <BriefcaseBusiness size={17} />

                <dd>
                  <span>
                    Job Type
                  </span>

                  <strong>
                    {selectedJob.job_types?.[0] ||
                      "Not listed"}
                  </strong>
                </dd>
              </div>


              <div>
                <MapPin size={17} />

                <dd>
                  <span>
                    Location
                  </span>

                  <strong>
                    {selectedJob.remote
                      ? "Remote"
                      : selectedJob.location ||
                        "Location not listed"}
                  </strong>
                </dd>
              </div>


              <div>
                <Building2 size={17} />

                <dd>
                  <span>
                    Company
                  </span>

                  <strong>
                    {selectedJob.company_name}
                  </strong>
                </dd>
              </div>

            </dl>

          </div>

        </aside>
      )}

    </section>
  );
}

export default JobBoard;
