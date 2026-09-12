import {
  ArrowLeft,
  Bookmark,
  BriefcaseBusiness,
  MapPin,
  ExternalLink,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
function cleanDescription(html = "") {
  const textarea = document.createElement("textarea");

  textarea.innerHTML = html;

  const decoded = textarea.value;

  const div = document.createElement("div");

  div.innerHTML = decoded;

  return div.textContent || div.innerText || "";
}
function JobDetails({ savedJobs }) {
  const navigate = useNavigate();
  const { slug } = useParams();

  const job = savedJobs.find(
    (savedJob) => savedJob.slug === slug
  );

  if (!job) {
    return (
      <section className="job-details-page">
        <button
          className="job-details-back"
          onClick={() => navigate("/saved-jobs")}
        >
          <ArrowLeft size={17} />
          Back to Saved Jobs
        </button>

        <div className="job-details-empty">
          <h2>Job not found</h2>
          <p>
            This job is no longer available in your saved jobs.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="job-details-page">

      <button
        className="job-details-back"
        onClick={() => navigate("/saved-jobs")}
      >
        <ArrowLeft size={17} />
        Back to Saved Jobs
      </button>


      <div className="job-details-card">

        <div className="job-details-heading">

          <div className="job-details-logo">
            {job.company_name
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <h1>{job.title}</h1>
            <p>{job.company_name}</p>
          </div>

        </div>


        <div className="job-details-meta">

          <span>
            <MapPin size={16} />

            {job.remote
              ? "Remote"
              : job.location || "Location not listed"}
          </span>

          <span>
            <BriefcaseBusiness size={16} />
            {job.job_types?.[0] || "Job type not listed"}
          </span>

        </div>


        <div className="job-details-tags">

          {job.tags?.map((tag) => (
            <span key={tag}>
              {tag}
            </span>
          ))}

        </div>


        <div className="job-details-section">

          <h2>About the role</h2>

         <p>
  {cleanDescription(job.description) ||
    "No description available."}
</p>

        </div>


        <div className="job-details-actions">

          <button className="job-details-saved">
            <Bookmark
              size={17}
              fill="currentColor"
            />
            Saved
          </button>

          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="job-details-apply"
          >
            Apply on Company Site
            <ExternalLink size={16} />
          </a>

        </div>

      </div>

    </section>
  );
}

export default JobDetails;