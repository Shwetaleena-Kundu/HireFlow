import {
  Clock,
  Video,
  MapPin,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function UpcomingInterviews({ applications = [] }) {
  const navigate = useNavigate();

  const interviewApplications = applications
    .filter(
      (application) =>
        application.status === "Interview"
    )
    .slice(0, 3);

  return (
    <section className="upcoming-interviews">
      <div className="section-heading">
        <h2>Upcoming Interviews</h2>

        <button
          type="button"
          className="view-all-button"
          onClick={() => navigate("/interviews")}
        >
          View All →
        </button>
      </div>

      <div className="interview-list">
        {interviewApplications.length > 0 ? (
          interviewApplications.map((interview) => {
            const interviewDate = interview.nextDate
              ? new Date(interview.nextDate)
              : null;

            const hasValidDate =
              interviewDate &&
              !Number.isNaN(interviewDate.getTime());

            const month = hasValidDate
              ? interviewDate
                  .toLocaleDateString("en-US", {
                    month: "short",
                  })
                  .toUpperCase()
              : "TBD";

            const day = hasValidDate
              ? interviewDate.getDate()
              : "--";

            return (
              <div
                className="interview-item"
                key={interview.id}
              >
                <div className="interview-date">
                  <span>{month}</span>

                  <strong>{day}</strong>
                </div>

                <div className="interview-info">
                  <h3>{interview.role}</h3>

                  <p>{interview.company}</p>

                  <div className="interview-details">
                    <span>
                      <Clock size={15} />

                      {interview.nextDate
                        ? interview.nextDate
                        : "Date not scheduled"}
                    </span>

                    <span>
                      {interview.mode === "On-site" ? (
                        <MapPin size={15} />
                      ) : (
                        <Video size={15} />
                      )}

                      {interview.mode}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="dashboard-empty-state">
            No upcoming interviews yet.
          </div>
        )}
      </div>
    </section>
  );
}

export default UpcomingInterviews;