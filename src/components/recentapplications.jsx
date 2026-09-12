import { useNavigate } from "react-router-dom";

function RecentApplications({ applications = [] }) {
  const navigate = useNavigate();

  const recentApplications = [...applications]
    .sort((a, b) => {
      const firstDate =
        new Date(a.appliedDate).getTime() || 0;

      const secondDate =
        new Date(b.appliedDate).getTime() || 0;

      return secondDate - firstDate;
    })
    .slice(0, 5);

  return (
    <section className="recent-applications">
      <div className="section-heading">
        <h2>Recent Applications</h2>

        <button
          type="button"
          className="view-all-button"
          onClick={() => navigate("/applications")}
        >
          View All →
        </button>
      </div>

      <div className="application-list">
        {recentApplications.length > 0 ? (
          recentApplications.map((application) => (
            <div
              className="application-item"
              key={application.id}
            >
              <div className="application-main">
                <div className="dashboard-company-initial">
                  {application.company
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3>{application.role}</h3>

                  <p>{application.company}</p>
                </div>
              </div>

              <span
                className={`application-status status-${application.status.toLowerCase()}`}
              >
                {application.status}
              </span>

              <time className="application-date">
                {application.appliedDate}
              </time>
            </div>
          ))
        ) : (
          <div className="dashboard-empty-state">
            No applications yet.
          </div>
        )}
      </div>
    </section>
  );
}

export default RecentApplications;