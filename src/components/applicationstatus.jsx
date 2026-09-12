import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

function ApplicationStatus({ applications = [] }) {
  const statusData = [
    {
      name: "Applied",
      value: applications.filter(
        (application) => application.status === "Applied"
      ).length,
      color: "#6c5ce7",
    },

    {
      name: "Screening",
      value: applications.filter(
        (application) => application.status === "Screening"
      ).length,
      color: "#3d8bfd",
    },

    {
      name: "Interview",
      value: applications.filter(
        (application) => application.status === "Interview"
      ).length,
      color: "#35c995",
    },

    {
      name: "Offer",
      value: applications.filter(
        (application) => application.status === "Offer"
      ).length,
      color: "#ffb52e",
    },

    {
      name: "Rejected",
      value: applications.filter(
        (application) => application.status === "Rejected"
      ).length,
      color: "#ff5364",
    },
  ];

  return (
    <section className="status-card">
      <h2>Application Status</h2>

      <div className="status-content">
        <div className="status-chart">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
              >
                {statusData.map((status) => (
                  <Cell
                    key={status.name}
                    fill={status.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="chart-total">
            <strong>{applications.length}</strong>

            <span>Applications</span>
          </div>
        </div>

        <div className="status-list">
          {statusData.map((status) => (
            <div
              className="status-row"
              key={status.name}
            >
              <div>
                <span
                  className="status-dot"
                  style={{
                    backgroundColor: status.color,
                  }}
                ></span>

                <span>{status.name}</span>
              </div>

              <strong>{status.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ApplicationStatus;