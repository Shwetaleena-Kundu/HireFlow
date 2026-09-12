import { useState } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ApplicationActivity({ applications = [] }) {
  const [period, setPeriod] = useState("30");

  const numberOfDays = Number(period);

  const today = new Date();

  const startDate = new Date();

  startDate.setDate(
    today.getDate() - numberOfDays + 1
  );

  const groupedApplications = applications.reduce(
    (groups, application) => {
      const date = new Date(application.appliedDate);

      if (Number.isNaN(date.getTime())) {
        return groups;
      }

      if (date < startDate || date > today) {
        return groups;
      }

      const dateKey = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      groups[dateKey] = (groups[dateKey] || 0) + 1;

      return groups;
    },
    {}
  );

  const activityData = Object.entries(
    groupedApplications
  )
    .map(([date, count]) => ({
      date,
      applications: count,
      timestamp: new Date(
        `${date}, ${today.getFullYear()}`
      ).getTime(),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  return (
    <section className="activity-card">
      <div className="activity-header">
        <div>
          <h2>Application Activity</h2>

          <p>
            Your job application progress over time.
          </p>
        </div>

        <select
          className="activity-filter"
          value={period}
          onChange={(event) =>
            setPeriod(event.target.value)
          }
          aria-label="Select activity period"
        >
          <option value="30">Last 30 days</option>

          <option value="60">Last 60 days</option>

          <option value="90">Last 90 days</option>
        </select>
      </div>

      <div className="activity-chart">
        {activityData.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
          >
            <AreaChart
              data={activityData}
              margin={{
                top: 5,
                right: 5,
                left: -20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                stroke="#e5e5ee"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#77778d",
                  fontSize: 11,
                }}
                minTickGap={15}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#77778d",
                  fontSize: 11,
                }}
                allowDecimals={false}
                width={35}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="applications"
                stroke="#6c5ce7"
                fill="#e8e4ff"
                strokeWidth={3}
                activeDot={{
                  r: 5,
                  fill: "#6c5ce7",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="dashboard-empty-state">
            No application activity in this period.
          </div>
        )}
      </div>
    </section>
  );
}

export default ApplicationActivity;