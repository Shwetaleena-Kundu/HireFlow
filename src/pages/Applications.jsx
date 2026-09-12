import { useState } from "react";

import {
  Plus,
  Search,
  SlidersHorizontal,
  ChevronDown,
  List,
  LayoutGrid,
  MapPin,
  BriefcaseBusiness,
  House,
  CalendarDays,
  ArrowRight,
  ExternalLink,
  Link as LinkIcon,
  FileText,
  Download,
  Pencil,
  Trash2,
  Clock3,
  CheckCircle2,
  Circle,
  Bookmark,
  X,
} from "lucide-react";



function Applications({ applications, setApplications }) {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  // Toolbar controls
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [workModeFilter, setWorkModeFilter] = useState("All");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("list");

  // Add Application modal
  const [showAddApplication, setShowAddApplication] = useState(false);
  const [newApplication, setNewApplication] = useState({
    company: "",
    role: "",
    location: "",
    type: "Full-time",
    mode: "On-site",
    appliedDate: new Date().toISOString().slice(0, 10),
    url: "",
  });

  const selectedApplication =
    applications.find(
      (application) => application.id === selectedApplicationId
    ) || null;

  const statusTabs = [
    "All",
    "Applied",
    "Screening",
    "Interview",
    "Offer",
    "Rejected",
  ];

  const filteredApplications = applications
    .filter((application) => {
      const matchesTab =
        activeTab === "All" || application.status === activeTab;

      const searchableText = [
        application.company,
        application.role,
        application.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(
        searchTerm.trim().toLowerCase()
      );

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      const matchesWorkMode =
        workModeFilter === "All" ||
        application.mode === workModeFilter;

      const matchesJobType =
        jobTypeFilter === "All" ||
        application.type === jobTypeFilter;

      return (
        matchesTab &&
        matchesSearch &&
        matchesStatus &&
        matchesWorkMode &&
        matchesJobType
      );
    })
    .sort((a, b) => {
      if (sortBy === "company-az") {
        return (a.company || "").localeCompare(b.company || "");
      }

      if (sortBy === "company-za") {
        return (b.company || "").localeCompare(a.company || "");
      }

      const aDate = new Date(a.appliedDate).getTime() || 0;
      const bDate = new Date(b.appliedDate).getTime() || 0;

      return sortBy === "oldest"
        ? aDate - bDate
        : bDate - aDate;
    });

  const countByStatus = (status) => {
    if (status === "All") return applications.length;

    return applications.filter(
      (application) => application.status === status
    ).length;
  };

  const updateSelectedStatus = (status) => {
    if (!selectedApplication) return;

    setApplications(
      applications.map((application) =>
        application.id === selectedApplication.id
          ? { ...application, status }
          : application
      )
    );
  };

  const deleteSelectedApplication = () => {
    if (!selectedApplication) return;

    const updatedApplications = applications.filter(
      (application) => application.id !== selectedApplication.id
    );

    setApplications(updatedApplications);
    setSelectedApplicationId(null);
  };

  const stages = [
    "Applied",
    "Screening",
    "Interview",
    "Offer",
  ];

  const getStageNumber = (status) => {
    return stages.indexOf(status);
  };

  const handleNewApplicationChange = (event) => {
    const { name, value } = event.target;

    setNewApplication((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const closeAddApplication = () => {
    setShowAddApplication(false);
  };

  const handleAddApplication = (event) => {
    event.preventDefault();

    if (!newApplication.company.trim() || !newApplication.role.trim()) {
      return;
    }

    const formattedAppliedDate = newApplication.appliedDate
      ? new Date(`${newApplication.appliedDate}T00:00:00`).toLocaleDateString(
          "en-US",
          { month: "short", day: "numeric", year: "numeric" }
        )
      : new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

    const application = {
      id: Date.now(),
      slug: `${newApplication.company}-${newApplication.role}-${Date.now()}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      company: newApplication.company.trim(),
      role: newApplication.role.trim(),
      location: newApplication.location.trim() || "Location not listed",
      type: newApplication.type,
      mode: newApplication.mode,
      status: "Applied",
      appliedDate: formattedAppliedDate,
      nextAction: "Waiting for response",
      nextDate: "",
      url: newApplication.url.trim(),
    };

    setApplications((current) => [application, ...current]);

    setNewApplication({
      company: "",
      role: "",
      location: "",
      type: "Full-time",
      mode: "On-site",
      appliedDate: new Date().toISOString().slice(0, 10),
      url: "",
    });

    setActiveTab("All");
    setShowAddApplication(false);
  };

  return (
    <section
      className={`applications-page ${
        selectedApplication ? "details-open" : ""
      }`}
    >
      <main className="applications-main">
        <header className="applications-header">
          <div>
            <h1>Applications</h1>

            <p>
              Your job applications, all in one place.
              Track, update and never miss a follow-up.
            </p>
          </div>

          <button
            type="button"
            className="add-application-button"
            onClick={() => setShowAddApplication(true)}
          >
            <Plus size={18} />
            Add Application
          </button>
        </header>

        <div className="application-tabs">
          {statusTabs.map((status) => (
            <button
              className={
                activeTab === status
                  ? "application-tab active"
                  : "application-tab"
              }
              key={status}
              onClick={() => setActiveTab(status)}
            >
              {status} ({countByStatus(status)})
            </button>
          ))}
        </div>

        <section className="applications-list-container">
          <div className="applications-toolbar">
            <div className="applications-search">
              <Search size={18} />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by company, role or location..."
              />
            </div>

            <button
              type="button"
              className={`applications-filter-button ${
                showFilters ? "active" : ""
              }`}
              onClick={() => setShowFilters((current) => !current)}
            >
              <SlidersHorizontal size={17} />
              Filter
            </button>

            <div className="applications-sort-wrap">
              <select
                className="applications-sort-select"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort applications"
              >
                <option value="newest">Newest applied</option>
                <option value="oldest">Oldest applied</option>
                <option value="company-az">Company A-Z</option>
                <option value="company-za">Company Z-A</option>
              </select>
              <ChevronDown size={16} />
            </div>

            <div className="applications-view-buttons">
              <button
                type="button"
                className={
                  viewMode === "list"
                    ? "view-mode-button active"
                    : "view-mode-button"
                }
                aria-label="List view"
                onClick={() => setViewMode("list")}
              >
                <List size={17} />
                List
              </button>

              <button
                type="button"
                className={
                  viewMode === "board"
                    ? "view-mode-button active"
                    : "view-mode-button"
                }
                aria-label="Board view"
                onClick={() => setViewMode("board")}
              >
                <LayoutGrid size={17} />
                Board
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="applications-filter-panel">
              <label>
                <span>Status</span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  <option value="All">All statuses</option>
                  <option value="Applied">Applied</option>
                  <option value="Screening">Screening</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </label>

              <label>
                <span>Work mode</span>
                <select
                  value={workModeFilter}
                  onChange={(event) =>
                    setWorkModeFilter(event.target.value)
                  }
                >
                  <option value="All">All modes</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </label>

              <label>
                <span>Job type</span>
                <select
                  value={jobTypeFilter}
                  onChange={(event) =>
                    setJobTypeFilter(event.target.value)
                  }
                >
                  <option value="All">All job types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </label>

              <button
                type="button"
                className="clear-application-filters"
                onClick={() => {
                  setStatusFilter("All");
                  setWorkModeFilter("All");
                  setJobTypeFilter("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          {viewMode === "list" ? (
          <div className="application-cards">
            {filteredApplications.map((application) => {
              const currentStage =
                getStageNumber(application.status);

              return (
                <article
                  className={
                    application.id === selectedApplicationId
                      ? "application-tracker-card selected"
                      : "application-tracker-card"
                  }
                  key={application.id}
                >
                  <div className="tracker-card-top">
                    <div className="tracker-company">
                      <div>
                        <h2>{application.company}</h2>
                        <h3>{application.role}</h3>

                        <div className="tracker-job-information">
                          <span>
                            <MapPin size={13} />
                            {application.location}
                          </span>

                          <span>
                            <BriefcaseBusiness size={13} />
                            {application.type}
                          </span>

                          <span>
                            <House size={13} />
                            {application.mode}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="tracker-bookmark-button"
                        aria-label={`Save ${application.company} application`}
                      >
                        <Bookmark size={17} />
                      </button>
                    </div>

                    <div className="tracker-next-step">
                      <span>Next step</span>

                      <div>
                        {application.nextDate ? (
                          <CalendarDays size={17} />
                        ) : (
                          <Clock3 size={17} />
                        )}

                        <p>
                          <strong>
                            {application.nextAction}
                          </strong>

                          {application.nextDate && (
                            <small>
                              {application.nextDate}
                            </small>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="tracker-applied-date">
                      <span>Applied on</span>
                      <time>{application.appliedDate}</time>
                    </div>
                  </div>

                  <div className="tracker-card-bottom">
                    <div className="application-progress">
                      {stages.map((stage, index) => (
                        <div
                          className="progress-stage"
                          key={stage}
                        >
                          <div className="progress-stage-line">
                            {index <= currentStage ? (
                              <CheckCircle2
                                className="completed-stage"
                                size={20}
                              />
                            ) : (
                              <Circle
                                className="incomplete-stage"
                                size={20}
                              />
                            )}

                            {index < stages.length - 1 && (
                              <span
                                className={
                                  index < currentStage
                                    ? "progress-line completed"
                                    : "progress-line"
                                }
                              ></span>
                            )}
                          </div>

                          <span>{stage}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="view-application-button"
                      onClick={() =>
                        setSelectedApplicationId(application.id)
                      }
                    >
                      View
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          ) : (
            <div className="applications-board">
              {stages.map((stage) => {
                const stageApplications =
                  filteredApplications.filter(
                    (application) => application.status === stage
                  );

                return (
                  <section className="board-column" key={stage}>
                    <div className="board-column-header">
                      <h3>{stage}</h3>
                      <span>{stageApplications.length}</span>
                    </div>

                    <div className="board-column-cards">
                      {stageApplications.map((application) => (
                        <article
                          className="board-application-card"
                          key={application.id}
                        >
                          <span className="board-company">
                            {application.company}
                          </span>

                          <h4>{application.role}</h4>

                          <p>
                            <MapPin size={13} />
                            {application.location}
                          </p>

                          <div>
                            <span>{application.mode}</span>

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedApplicationId(application.id)
                              }
                            >
                              View
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </article>
                      ))}

                      {stageApplications.length === 0 && (
                        <p className="board-empty">
                          No applications
                        </p>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          {filteredApplications.length === 0 && (
            <div className="applications-empty-state">
              No applications match this filter.
            </div>
          )}
        </section>
      </main>

      {selectedApplication && (
        <aside className="application-details-panel">
          <button
            type="button"
            className="close-details-button"
            aria-label="Close details"
            onClick={() => setSelectedApplicationId(null)}
          >
            <X size={20} />
          </button>

          <div className="details-company">
            <div>
              <h2>{selectedApplication.company}</h2>
              <p>{selectedApplication.role}</p>
            </div>
          </div>

          <div className="details-job-meta">
            <span>
              <MapPin size={14} />
              {selectedApplication.location}
            </span>

            <span>•</span>
            <span>{selectedApplication.type}</span>
            <span>•</span>
            <span>{selectedApplication.mode}</span>
          </div>

          {selectedApplication.url ? (
            <a
              href={selectedApplication.url}
              target="_blank"
              rel="noreferrer"
              className="job-posting-link"
            >
              <LinkIcon size={15} />
              View Job Posting
              <ExternalLink size={13} />
            </a>
          ) : (
            <span className="job-posting-unavailable">
              <LinkIcon size={15} />
              No job link added
            </span>
          )}

          <div className="details-status-row">
            <div>
              <strong>Status</strong>
              <span className="details-status">
                {selectedApplication.status}
              </span>
            </div>

            <select
              value={selectedApplication.status}
              onChange={(event) =>
                updateSelectedStatus(event.target.value)
              }
            >
              {["Applied", "Screening", "Interview", "Offer", "Rejected"].map(
                (status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="details-progress">
            {stages.map((stage, index) => {
              const selectedStage =
                getStageNumber(selectedApplication.status);

              return (
                <div
                  className="details-progress-stage"
                  key={stage}
                >
                  <div>
                    {index <= selectedStage ? (
                      <CheckCircle2
                        className="completed-stage"
                        size={20}
                      />
                    ) : (
                      <Circle
                        className="incomplete-stage"
                        size={20}
                      />
                    )}

                    {index < stages.length - 1 && (
                      <span
                        className={
                          index < selectedStage
                            ? "progress-line completed"
                            : "progress-line"
                        }
                      ></span>
                    )}
                  </div>

                  <span>{stage}</span>
                </div>
              );
            })}
          </div>

          <div className="next-action-card">
            <div>
              <span>Next Action</span>

              <p>
                {selectedApplication.nextDate ? (
                  <CalendarDays size={18} />
                ) : (
                  <Clock3 size={18} />
                )}

                <strong>
                  {selectedApplication.nextAction}
                  {selectedApplication.nextDate && (
                    <small>
                      {selectedApplication.nextDate}
                    </small>
                  )}
                </strong>
              </p>
            </div>
          </div>

          <div className="details-tabs">
            <button className="active">Details</button>
            <button>Notes</button>
            <button>History</button>
            <button>Documents</button>
          </div>

          <div className="details-information">
            <div>
              <CalendarDays size={15} />
              <span>Applied on</span>
              <strong>{selectedApplication.appliedDate}</strong>
            </div>

            <div>
              <BriefcaseBusiness size={15} />
              <span>Job Type</span>
              <strong>{selectedApplication.type}</strong>
            </div>

            <div>
              <MapPin size={15} />
              <span>Location</span>
              <strong>{selectedApplication.location}</strong>
            </div>

            <div>
              <House size={15} />
              <span>Work Mode</span>
              <strong>{selectedApplication.mode}</strong>
            </div>

            <div>
              <LinkIcon size={15} />
              <span>Job Link</span>

              {selectedApplication.url ? (
                <a
                  href={selectedApplication.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open posting
                </a>
              ) : (
                <strong>Not added</strong>
              )}
            </div>

            <div>
              <FileText size={15} />
              <span>Resume Used</span>
              <a href="#">
                Frontend_Resume.pdf
                <Download size={14} />
              </a>
            </div>
          </div>

          <div className="application-notes">
            <div>
              <strong>
                <Pencil size={15} />
                Notes
              </strong>

              <button type="button">
                Edit
              </button>
            </div>

            <p>
              Keep notes for this application here.
            </p>
          </div>

          <button
            type="button"
            className="delete-application-button"
            onClick={deleteSelectedApplication}
          >
            <Trash2 size={17} />
            Delete Application
          </button>
        </aside>
      )}

      {showAddApplication && (
        <div
          className="add-application-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeAddApplication();
            }
          }}
        >
          <div
            className="add-application-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-application-title"
          >
            <div className="add-application-modal-header">
              <div>
                <h2 id="add-application-title">Add Application</h2>
                <p>Add a job you applied to outside HireFlow.</p>
              </div>

              <button
                type="button"
                className="close-add-application"
                aria-label="Close add application"
                onClick={closeAddApplication}
              >
                <X size={20} />
              </button>
            </div>

            <form className="add-application-form" onSubmit={handleAddApplication}>
              <label>
                <span>Company *</span>
                <input
                  type="text"
                  name="company"
                  value={newApplication.company}
                  onChange={handleNewApplicationChange}
                  placeholder="e.g. Microsoft"
                  required
                />
              </label>

              <label>
                <span>Job role *</span>
                <input
                  type="text"
                  name="role"
                  value={newApplication.role}
                  onChange={handleNewApplicationChange}
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </label>

              <label className="add-form-full">
                <span>Location</span>
                <input
                  type="text"
                  name="location"
                  value={newApplication.location}
                  onChange={handleNewApplicationChange}
                  placeholder="e.g. Bengaluru, India"
                />
              </label>

              <label>
                <span>Job type</span>
                <select
                  name="type"
                  value={newApplication.type}
                  onChange={handleNewApplicationChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </label>

              <label>
                <span>Work mode</span>
                <select
                  name="mode"
                  value={newApplication.mode}
                  onChange={handleNewApplicationChange}
                >
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
              </label>

              <label>
                <span>Applied date</span>
                <input
                  type="date"
                  name="appliedDate"
                  value={newApplication.appliedDate}
                  onChange={handleNewApplicationChange}
                />
              </label>

              <label>
                <span>Job link</span>
                <input
                  type="url"
                  name="url"
                  value={newApplication.url}
                  onChange={handleNewApplicationChange}
                  placeholder="https://..."
                />
              </label>

              <div className="add-application-form-actions add-form-full">
                <button
                  type="button"
                  className="cancel-add-application"
                  onClick={closeAddApplication}
                >
                  Cancel
                </button>

                <button type="submit" className="submit-add-application">
                  <Plus size={17} />
                  Add Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Applications;
