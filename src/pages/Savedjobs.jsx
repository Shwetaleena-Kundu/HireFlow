import { useNavigate } from "react-router-dom";

import {
  Bookmark,
  MapPin,
  ArrowRight,
} from "lucide-react";


function SavedJobs({
  savedJobs,
  setSavedJobs,
}) {

  // Navigate to another React page
  const navigate = useNavigate();


  // Remove job from saved jobs
  const removeSavedJob = (jobSlug) => {

    setSavedJobs(
      savedJobs.filter(
        (job) => job.slug !== jobSlug
      )
    );

  };


  return (

    <section className="saved-jobs-page">


      {/* ================================
          HEADER
      ================================= */}

      <div className="saved-jobs-header">

        <div>

          <h1>
            Saved Jobs
          </h1>

          <p>
            Jobs you bookmarked from the Job Board.
          </p>

        </div>


        <span className="saved-count">

          {savedJobs.length} saved

        </span>

      </div>



      {/* ================================
          EMPTY STATE
      ================================= */}

      {savedJobs.length === 0 ? (

        <div className="saved-empty">

          <Bookmark size={42} />

          <h2>
            No saved jobs yet
          </h2>

          <p>
            Save jobs from the Job Board and they will
            appear here.
          </p>

        </div>

      ) : (


        /* ================================
            SAVED JOBS LIST
        ================================= */

        <div className="saved-jobs-list">


          {savedJobs.map((job) => (

            <article
              className="saved-job-card"
              key={job.slug}
            >


              {/* JOB INFORMATION */}

              <div className="saved-job-main">


                {/* COMPANY LOGO */}

                <div className="saved-company-logo">

                  {job.company_name
                    ?.charAt(0)
                    .toUpperCase()}

                </div>



                <div className="saved-job-info">


                  {/* JOB TITLE */}

                  <h3>
                    {job.title}
                  </h3>



                  {/* COMPANY */}

                  <p className="saved-company">

                    {job.company_name}

                  </p>



                  {/* LOCATION */}

                  <p className="saved-location">

                    <MapPin size={14} />

                    {job.remote
                      ? "Remote"
                      : job.location ||
                        "Location not listed"}

                  </p>



                  {/* JOB TAGS */}

                  <div className="saved-tags">

                    {job.tags
                      ?.slice(0, 4)
                      .map((tag) => (

                        <span key={tag}>
                          {tag}
                        </span>

                      ))}

                  </div>

                </div>

              </div>



              {/* ================================
                  ACTION BUTTONS
              ================================= */}

              <div className="saved-job-actions">


                {/* REMOVE */}

                <button
                  className="saved-remove-btn"
                  onClick={() =>
                    removeSavedJob(job.slug)
                  }
                >

                  <Bookmark
                    size={16}
                    fill="currentColor"
                  />

                  Remove

                </button>



                {/* VIEW DETAILS */}

                <button
                  className="saved-view-btn"
                  onClick={() =>
                    navigate(
                      `/job-details/${job.slug}`
                    )
                  }
                >

                  View Details

                  <ArrowRight size={15} />

                </button>


              </div>

            </article>

          ))}

        </div>

      )}

    </section>

  );

}


export default SavedJobs;