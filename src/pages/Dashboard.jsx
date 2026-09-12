import Header from "../components/header.jsx";
import StatsCards from "../components/statcards.jsx";
import ApplicationActivity from "../components/applicationactivity.jsx";
import ApplicationStatus from "../components/applicationstatus.jsx";
import RecentApplications from "../components/recentapplications.jsx";
import UpcomingInterviews from "../components/upcominginterviews.jsx";
import MotivationBanner from "../components/motivationbanner.jsx";

function Dashboard({ applications, savedJobs, interviews, userSession }) {
  return (
    <section className="dashboard-area">
      <Header userSession={userSession} />

      <StatsCards applications={applications} savedJobs={savedJobs} />

      <div className="charts-grid">
        <ApplicationActivity applications={applications} />
        <ApplicationStatus applications={applications} />
      </div>

      <div className="bottom-grid">
        <RecentApplications applications={applications} />

        <div className="dashboard-right-column">
          <UpcomingInterviews applications={applications} interviews={interviews} />
          <MotivationBanner />
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
