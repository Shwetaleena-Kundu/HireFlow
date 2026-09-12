import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Download,
  Lightbulb,
  MessageCircle,
  Send,
  Target,
  Trophy,
  Users,
} from "lucide-react";

import { useMemo, useState } from "react";

const RESPONSE_STATUSES = new Set(["screening", "interview", "offer", "rejected"]);

const clean = (value) => String(value || "").trim().toLowerCase();

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function percent(part, total) {
  return total ? Math.round((part / total) * 100) : 0;
}

function countStatus(applications, status) {
  return applications.filter(
    (application) => clean(application.status) === clean(status)
  ).length;
}

function inPeriod(applications, period) {
  if (period === "All") return applications;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - Number(period));

  return applications.filter((application) => {
    const date = toDate(application.appliedDate);
    return date && date >= cutoff;
  });
}

function buildPerformance(applications, field, defaults) {
  const result = new Map(
    defaults.map((name) => [
      name,
      { name, applications: 0, responses: 0, interviews: 0, offers: 0 },
    ])
  );

  applications.forEach((application) => {
    const raw =
      application[field] ||
      (field === "type" ? application.jobType : application.workMode);

    const name = String(raw || "Not listed").trim() || "Not listed";

    if (!result.has(name)) {
      result.set(name, {
        name,
        applications: 0,
        responses: 0,
        interviews: 0,
        offers: 0,
      });
    }

    const item = result.get(name);
    const status = clean(application.status);

    item.applications += 1;

    if (RESPONSE_STATUSES.has(status)) item.responses += 1;
    if (status === "interview" || status === "offer") item.interviews += 1;
    if (status === "offer") item.offers += 1;
  });

  return [...result.values()].map((item) => ({
    ...item,
    responseRate: percent(item.responses, item.applications),
  }));
}

function AnalyticsHeader({
  period,
  setPeriod,
  applications,
  interviews,
  userSession,
}) {
  const exportReport = () => {
    const total = applications.length;
    const responses = applications.filter((application) =>
      RESPONSE_STATUSES.has(clean(application.status))
    ).length;

    const report = [
      "HireFlow Analytics Report",
      `Generated: ${new Date().toLocaleDateString()}`,
      "",
      `Total Applications: ${total}`,
      `Response Rate: ${percent(responses, total)}%`,
      `Scheduled Interviews: ${interviews.length}`,
      `Offers: ${countStatus(applications, "Offer")}`,
      "",
      "Tracked Applications",
      ...applications.map(
        (application) =>
          `${application.company || "Company"} | ${application.role || "Role"} | ${
            application.status || "Applied"
          } | ${application.appliedDate || "No date"}`
      ),
    ].join("\n");

    const blob = new Blob([report], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "hireflow-analytics-report.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <header className="analytics-header">
      <div>
        <h1>Analytics</h1>
        <p>Turn your activity into insights. Apply smarter, grow faster.</p>
      </div>

      <div className="analytics-header-actions">
        <label className="analytics-period">
          <CalendarDays size={17} />

          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
            <option value="180">Last 6 Months</option>
            <option value="All">All Time</option>
          </select>
        </label>

        <button
          type="button"
          className="export-report"
          onClick={exportReport}
        >
          <Download size={17} />
          Export Report
        </button>

        <button
          type="button"
          className="analytics-notification"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span />
        </button>

        {userSession && (
          <>
            <div className="analytics-avatar">
              {userSession.name?.trim().charAt(0).toUpperCase()}
            </div>
            <strong>
              Hi, {userSession.name?.trim().split(" ")[0]}!
            </strong>
            <span>⌄</span>
          </>
        )}
      </div>
    </header>
  );
}

function AnalyticsTabs({ activeTab, setActiveTab }) {
  const tabs = [
    "Overview",
    "Applications",
    "Interviews",
    "Job Types",
    "Work Modes",
    "Insights",
  ];

  return (
    <nav className="analytics-tabs">
      {tabs.map((tab) => (
        <button
          type="button"
          className={activeTab === tab ? "active" : ""}
          onClick={() => setActiveTab(tab)}
          key={tab}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

function Statistics({ applications, interviews }) {
  const total = applications.length;

  const responses = applications.filter((application) =>
    RESPONSE_STATUSES.has(clean(application.status))
  ).length;

  const interviewStage = applications.filter((application) =>
    ["interview", "offer"].includes(clean(application.status))
  ).length;

  const offers = countStatus(applications, "Offer");

  const statistics = [
    {
      title: "Total Applications",
      value: total,
      change: `${total} tracked`,
      icon: <Send size={22} />,
      tone: "purple",
    },
    {
      title: "Response Rate",
      value: `${percent(responses, total)}%`,
      change: `${responses} responses`,
      icon: <MessageCircle size={22} />,
      tone: "blue",
    },
    {
      title: "Interviews",
      value: interviews.length || interviewStage,
      change: interviews.length
        ? `${interviews.length} scheduled`
        : `${interviewStage} reached interview`,
      icon: <Users size={22} />,
      tone: "violet",
    },
    {
      title: "Offers",
      value: offers,
      change: `${percent(offers, total)}% offer rate`,
      icon: <Trophy size={22} />,
      tone: "orange",
    },
  ];

  return (
    <section className="analytics-stats">
      {statistics.map((statistic) => (
        <article
          className={`analytics-stat ${statistic.tone}`}
          key={statistic.title}
        >
          <div className="analytics-stat-icon">{statistic.icon}</div>

          <div>
            <p>{statistic.title}</p>
            <h2>{statistic.value}</h2>
            <span>{statistic.change}</span>
          </div>
        </article>
      ))}
    </section>
  );
}

function ApplicationFunnel({ applications }) {
  const applied = applications.length;

  const screening = applications.filter((application) =>
    ["screening", "interview", "offer"].includes(clean(application.status))
  ).length;

  const interview = applications.filter((application) =>
    ["interview", "offer"].includes(clean(application.status))
  ).length;

  const offers = countStatus(applications, "Offer");

  const funnelSteps = [
    { value: applied, label: "Applied", className: "applied" },
    { value: screening, label: "Screening+", className: "screening" },
    { value: interview, label: "Interviews+", className: "interview" },
    { value: offers, label: "Offers", className: "offer" },
  ];

  return (
    <section className="analytics-card funnel-card">
      <header className="analytics-card-heading">
        <h2>Application Funnel</h2>
        <p>See how your applications progress</p>
      </header>

      <div className="funnel">
        {funnelSteps.map((step) => (
          <div
            className={`funnel-step ${step.className}`}
            key={step.label}
          >
            <strong>{step.value}</strong>
            <span>{step.label}</span>
          </div>
        ))}
      </div>

      <div className="funnel-insight">
        <Lightbulb size={21} />
        <p>
          {interview
            ? `Your interview-to-offer conversion is ${percent(
                offers,
                interview
              )}%.`
            : "Keep updating application statuses to unlock conversion insights."}
        </p>
      </div>
    </section>
  );
}

function ApplicationTrend({ applications }) {
  const [range, setRange] = useState("3M");

  const rangeMap = {
    "7D": 7,
    "30D": 30,
    "3M": 90,
    All: "All",
  };

  const data = useMemo(() => {
    const grouped = {};

    inPeriod(applications, rangeMap[range]).forEach((application) => {
      const date = toDate(application.appliedDate);
      if (!date) return;

      const key = date.toISOString().slice(0, 10);
      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-17)
      .map(([date, count]) => ({ date, count }));
  }, [applications, range]);

  const maximum = Math.max(1, ...data.map((item) => item.count));

  return (
    <section className="analytics-card trend-card">
      <header className="analytics-card-heading trend-heading">
        <h2>Application Trend</h2>

        <div>
          {["7D", "30D", "3M", "All"].map((item) => (
            <button
              type="button"
              className={range === item ? "active" : ""}
              onClick={() => setRange(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      {data.length ? (
        <div className="real-trend-chart">
          {data.map((item) => (
            <div
              className="real-trend-column"
              key={item.date}
              title={`${item.count} application(s)`}
            >
              <strong>{item.count}</strong>

              <span
                style={{
                  height: `${24 + (item.count / maximum) * 120}px`,
                }}
              />

              <small>
                {new Date(`${item.date}T00:00:00`).toLocaleDateString(
                  undefined,
                  {
                    month: "short",
                    day: "numeric",
                  }
                )}
              </small>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState text="No dated applications in this period yet." />
      )}
    </section>
  );
}

function AnalyticsSideColumn({ applications }) {
  const dated = applications
    .map((application) => toDate(application.appliedDate))
    .filter(Boolean)
    .sort((a, b) => b - a);

  let averageGap = null;

  if (dated.length > 1) {
    const gaps = [];

    for (let index = 0; index < dated.length - 1; index += 1) {
      gaps.push(
        (dated[index] - dated[index + 1]) /
          (1000 * 60 * 60 * 24)
      );
    }

    averageGap =
      gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
  }

  return (
    <aside className="analytics-side-column">
      <blockquote className="analytics-quote">
        “Progress is a series of small wins.”
        <span>💜</span>
      </blockquote>

      <section className="analytics-card response-time-card">
        <header>
          <Clock3 size={20} />
          <h2>Application Pace</h2>
        </header>

        <div className="response-time-main">
          <div>
            <strong>
              {averageGap === null ? "—" : `${averageGap.toFixed(1)} days`}
            </strong>
            <span>average gap between applications</span>
          </div>
        </div>

        <div className="response-time-details">
          <div>
            <span>Applications tracked</span>
            <strong>{applications.length}</strong>
          </div>

          <div>
            <span>With valid dates</span>
            <strong>{dated.length}</strong>
          </div>
        </div>
      </section>
    </aside>
  );
}

function ProgressBars({ items }) {
  const maximum = Math.max(1, ...items.map((item) => item.count));

  return (
    <div className="analytics-progress-list">
      {items.map((item) => (
        <div className="analytics-progress-row" key={item.name}>
          <span>{item.name}</span>

          <div>
            <i
              style={{
                width: `${(item.count / maximum) * 100}%`,
              }}
            />
          </div>

          <strong>{item.count}</strong>
        </div>
      ))}
    </div>
  );
}

function WorkModeChart({ applications }) {
  const modes = buildPerformance(applications, "mode", [
    "Remote",
    "Hybrid",
    "On-site",
  ]);

  const total = applications.length;

  const responses = applications.filter((application) =>
    RESPONSE_STATUSES.has(clean(application.status))
  ).length;

  return (
    <section className="analytics-card work-mode-card">
      <header className="small-card-heading">
        <BriefcaseBusiness size={20} />
        <h2>Performance by Work Mode</h2>
      </header>

      <div className="work-mode-content">
        <div className="work-mode-donut">
          <div>
            <strong>{percent(responses, total)}%</strong>
            <span>Response Rate</span>
          </div>
        </div>

        <div className="work-mode-list">
          {modes.slice(0, 3).map((mode, index) => (
            <p key={mode.name}>
              <i
                className={
                  index === 0
                    ? "remote"
                    : index === 1
                    ? "hybrid"
                    : "onsite"
                }
              />
              {mode.name}
              <strong>{mode.responseRate}%</strong>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function PerformanceTable({ title, rows }) {
  return (
    <section className="analytics-card source-card">
      <header className="small-card-heading">
        <BriefcaseBusiness size={20} />
        <h2>{title}</h2>
      </header>

      <div className="analytics-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Applications</th>
              <th>Interviews</th>
              <th>Offers</th>
              <th>Response</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.applications}</td>
                <td>{row.interviews}</td>
                <td>{row.offers}</td>
                <td>{row.responseRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function KeyInsights({ applications }) {
  const total = applications.length;
  const offers = countStatus(applications, "Offer");

  const modes = buildPerformance(applications, "mode", []).filter(
    (mode) => mode.applications > 0
  );

  const bestMode = [...modes].sort(
    (a, b) => b.responseRate - a.responseRate
  )[0];

  const last30 = inPeriod(applications, 30).length;

  const insights = total
    ? [
        {
          icon: "↑",
          tone: "green",
          text: `${last30} application${
            last30 === 1 ? "" : "s"
          } added in the last 30 days.`,
        },
        bestMode
          ? {
              icon: "↗",
              tone: "blue",
              text: `${bestMode.name} currently has your strongest response rate at ${bestMode.responseRate}%.`,
            }
          : null,
        {
          icon: "♟",
          tone: "pink",
          text: offers
            ? `${offers} offer${offers === 1 ? "" : "s"} from ${total} tracked applications.`
            : "No offers yet. Keep moving active applications through the pipeline.",
        },
      ].filter(Boolean)
    : [
        {
          icon: "↗",
          tone: "blue",
          text: "Start tracking applications to unlock personalized insights.",
        },
      ];

  return (
    <section className="analytics-card insights-card">
      <header className="small-card-heading">
        <Lightbulb size={20} />
        <h2>Key Insights</h2>
      </header>

      <div className="insights-list">
        {insights.map((insight) => (
          <article key={insight.text}>
            <span className={insight.tone}>{insight.icon}</span>
            <p>{insight.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Goals({ applications, interviews }) {
  const total = applications.length;

  const responses = applications.filter((application) =>
    RESPONSE_STATUSES.has(clean(application.status))
  ).length;

  const responseRate = percent(responses, total);
  const offers = countStatus(applications, "Offer");

  const goals = [
    {
      text: "Track 20 applications",
      current: total,
      target: 20,
      label: `${total} / 20`,
    },
    {
      text: "Reach a 50% response rate",
      current: responseRate,
      target: 50,
      label: `${responseRate}% / 50%`,
    },
    {
      text: "Schedule 5 interviews",
      current: interviews.length,
      target: 5,
      label: `${interviews.length} / 5`,
    },
    {
      text: "Receive 2 offers",
      current: offers,
      target: 2,
      label: `${offers} / 2`,
    },
  ];

  return (
    <section className="analytics-card goals-card">
      <header className="small-card-heading">
        <Target size={20} />
        <h2>Your Progress</h2>
      </header>

      {goals.map((goal) => (
        <div className="goal" key={goal.text}>
          <div>
            <span>{goal.text}</span>
            <strong>{goal.label}</strong>
          </div>

          <i>
            <span
              style={{
                width: `${Math.min(
                  100,
                  percent(goal.current, goal.target)
                )}%`,
              }}
            />
          </i>
        </div>
      ))}
    </section>
  );
}

function InterviewActivity({ interviews }) {
  const completed = interviews.filter(
    (interview) => interview.completed
  ).length;

  return (
    <div className="analytics-bottom-grid analytics-interview-grid">
      <section className="analytics-card">
        <header className="small-card-heading">
          <Users size={20} />
          <h2>Scheduled Interviews</h2>
        </header>

        <div className="analytics-big-number">
          <strong>{interviews.length}</strong>
          <span>interviews tracked</span>
        </div>
      </section>

      <section className="analytics-card">
        <header className="small-card-heading">
          <Trophy size={20} />
          <h2>Completed Interviews</h2>
        </header>

        <div className="analytics-big-number">
          <strong>{completed}</strong>
          <span>marked as done</span>
        </div>
      </section>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="analytics-empty-state">
      <Lightbulb size={20} />
      <span>{text}</span>
    </div>
  );
}


function ApplicationsAnalytics({ applications }) {
  const total = applications.length;
  const applied = countStatus(applications, "Applied");
  const screening = countStatus(applications, "Screening");
  const interview = countStatus(applications, "Interview");
  const offers = countStatus(applications, "Offer");
  const rejected = countStatus(applications, "Rejected");
  const active = total - rejected;

  const jobTypes = buildPerformance(applications, "type", [
    "Full-time",
    "Internship",
    "Part-time",
    "Contract",
  ]);

  const workModes = buildPerformance(applications, "mode", [
    "Remote",
    "Hybrid",
    "On-site",
  ]);

  return (
    <div className="applications-analytics-view">
      <section className="applications-analytics-summary">
        <article>
          <span>Total Applied</span>
          <strong>{total}</strong>
          <small>jobs tracked</small>
        </article>

        <article>
          <span>Active</span>
          <strong>{active}</strong>
          <small>still in your pipeline</small>
        </article>

        <article>
          <span>Interviews</span>
          <strong>{interview}</strong>
          <small>reached interview stage</small>
        </article>

        <article>
          <span>Rejected</span>
          <strong>{rejected}</strong>
          <small>closed applications</small>
        </article>
      </section>

      <div className="applications-analytics-grid">
        <ApplicationFunnel applications={applications} />

        <ApplicationTrend applications={applications} />
      </div>

      <section className="analytics-card applied-jobs-card">
        <header className="analytics-card-heading">
          <h2>Jobs You've Applied To</h2>
          <p>Your real application history</p>
        </header>

        {applications.length ? (
          <div className="applied-jobs-table-wrap">
            <table className="applied-jobs-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Job Type</th>
                  <th>Work Mode</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application) => (
                  <tr key={application.id || application.slug}>
                    <td>{application.company || "Company"}</td>
                    <td>{application.role || "Role"}</td>
                    <td>{application.type || application.jobType || "Not listed"}</td>
                    <td>{application.mode || application.workMode || "Not listed"}</td>
                    <td>
                      <span
                        className={`analytics-status-badge ${clean(
                          application.status
                        )}`}
                      >
                        {application.status || "Applied"}
                      </span>
                    </td>
                    <td>{application.appliedDate || "No date"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState text="No applications yet. Apply to a job and it will appear here automatically." />
        )}
      </section>

      <div className="applications-breakdown-grid">
        <section className="analytics-card">
          <header className="small-card-heading">
            <BriefcaseBusiness size={20} />
            <h2>Job Type Breakdown</h2>
          </header>

          <ProgressBars
            items={jobTypes.map((item) => ({
              name: item.name,
              count: item.applications,
            }))}
          />
        </section>

        <section className="analytics-card">
          <header className="small-card-heading">
            <Users size={20} />
            <h2>Work Mode Breakdown</h2>
          </header>

          <ProgressBars
            items={workModes.map((item) => ({
              name: item.name,
              count: item.applications,
            }))}
          />
        </section>

        <section className="analytics-card application-result-card">
          <header className="small-card-heading">
            <Trophy size={20} />
            <h2>Application Results</h2>
          </header>

          <div className="application-result-numbers">
            <div>
              <strong>{percent(interview + offers, total)}%</strong>
              <span>Interview rate</span>
            </div>

            <div>
              <strong>{percent(offers, total)}%</strong>
              <span>Offer rate</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Analytics({
  applications = [],
  interviews = [],
  userSession,
}) {
  const [period, setPeriod] = useState("90");
  const [activeTab, setActiveTab] = useState("Overview");

  const filteredApplications = useMemo(
    () => inPeriod(applications, period),
    [applications, period]
  );

  const jobTypes = useMemo(
    () =>
      buildPerformance(filteredApplications, "type", [
        "Full-time",
        "Internship",
        "Part-time",
        "Contract",
      ]),
    [filteredApplications]
  );

  const workModes = useMemo(
    () =>
      buildPerformance(filteredApplications, "mode", [
        "Remote",
        "Hybrid",
        "On-site",
      ]),
    [filteredApplications]
  );

  const jobTypeBars = jobTypes.map((item) => ({
    name: item.name,
    count: item.applications,
  }));

  const workModeBars = workModes.map((item) => ({
    name: item.name,
    count: item.applications,
  }));

  return (
    <section className="analytics-page">
      <AnalyticsHeader
        period={period}
        setPeriod={setPeriod}
        applications={filteredApplications}
        interviews={interviews}
        userSession={userSession}
      />

      <AnalyticsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "Overview" && (
        <>
          <Statistics
            applications={filteredApplications}
            interviews={interviews}
          />

          <div className="analytics-main-grid">
            <ApplicationFunnel applications={filteredApplications} />
            <ApplicationTrend applications={filteredApplications} />
            <AnalyticsSideColumn applications={filteredApplications} />
          </div>
        </>
      )}

      {activeTab === "Applications" && (
        <ApplicationsAnalytics applications={filteredApplications} />
      )}

      {activeTab !== "Overview" && activeTab !== "Applications" && (
        <Statistics
          applications={filteredApplications}
          interviews={interviews}
        />
      )}

      {(activeTab === "Overview" ||
        activeTab === "Job Types" ||
        activeTab === "Work Modes") && (
        <div className="analytics-middle-grid">
          <section className="analytics-card">
            <header className="small-card-heading">
              <h2>Applications by Job Type</h2>
            </header>
            <ProgressBars items={jobTypeBars} />
          </section>

          <section className="analytics-card">
            <header className="small-card-heading">
              <Trophy size={20} />
              <h2>Applications by Work Mode</h2>
            </header>
            <ProgressBars items={workModeBars} />
          </section>

          <WorkModeChart applications={filteredApplications} />
        </div>
      )}

      {(activeTab === "Overview" || activeTab === "Job Types") && (
        <div className="analytics-bottom-grid">
          <PerformanceTable
            title="Job Type Performance"
            rows={jobTypes}
          />
          <KeyInsights applications={filteredApplications} />
          <Goals
            applications={filteredApplications}
            interviews={interviews}
          />
        </div>
      )}

      {activeTab === "Work Modes" && (
        <div className="analytics-bottom-grid">
          <PerformanceTable
            title="Work Mode Performance"
            rows={workModes}
          />
          <KeyInsights applications={filteredApplications} />
          <Goals
            applications={filteredApplications}
            interviews={interviews}
          />
        </div>
      )}

      {(activeTab === "Overview" || activeTab === "Interviews") && (
        <InterviewActivity interviews={interviews} />
      )}

      {activeTab === "Insights" && (
        <div className="analytics-insights-focus">
          <KeyInsights applications={filteredApplications} />
          <Goals
            applications={filteredApplications}
            interviews={interviews}
          />
        </div>
      )}
    </section>
  );
}

export default Analytics;
