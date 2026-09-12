import {
  FileText,
  BriefcaseBusiness,
  CircleCheck,
  Bookmark,
} from "lucide-react";

function StatsCards({ applications = [], savedJobs = [] }) {
  const interviewCount = applications.filter(
    (application) => application.status === "Interview"
  ).length;

  const offerCount = applications.filter(
    (application) => application.status === "Offer"
  ).length;

  const stats = [
    {
      title: "Total Applications",
      number: applications.length,
      increase: "Tracked applications",
      icon: <FileText />,
      color: "purple-card",
    },

    {
      title: "Interviews",
      number: interviewCount,
      increase: "Interview stage",
      icon: <BriefcaseBusiness />,
      color: "blue-card",
    },

    {
      title: "Offers",
      number: offerCount,
      increase: "Offers received",
      icon: <CircleCheck />,
      color: "green-card",
    },

    {
      title: "Saved Jobs",
      number: savedJobs.length,
      increase: "Jobs bookmarked",
      icon: <Bookmark />,
      color: "orange-card",
    },
  ];

  return (
    <section className="stats-grid">
      {stats.map((stat) => (
        <div
          className={`stat-card ${stat.color}`}
          key={stat.title}
        >
          <div className="stat-icon">
            {stat.icon}
          </div>

          <div className="stat-information">
            <p>{stat.title}</p>

            <h2>{stat.number}</h2>

            <span className="stat-increase">
              {stat.increase}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}

export default StatsCards;