import { useEffect, useMemo, useState } from "react";
import leftBannerImage from "../assets/job-board-hero.png";

import {
  Bell,
  Bookmark,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  FileText,
  MapPin,
  MessageCircleQuestion,
  MoreHorizontal,
  NotebookPen,
  Plus,
  Search,
  Target,
  Video,
  Eye,
  Trash2,
  X,
} from "lucide-react";


const preparationColumns = [
  {
    id: 1,
    title: "To Learn",
    tone: "learn",
    tasks: [
      {
        id: 1,
        text: "Revise JavaScript (ES6+)",
        completed: false,
      },
      {
        id: 2,
        text: "Go through React Hooks",
        completed: false,
      },
    ],
  },
  {
    id: 2,
    title: "Practicing",
    tone: "practice",
    tasks: [
      {
        id: 3,
        text: "Solve coding questions",
        completed: false,
      },
      {
        id: 4,
        text: "Practice system design basics",
        completed: false,
      },
    ],
  },
  {
    id: 3,
    title: "Ready",
    tone: "ready",
    tasks: [
      {
        id: 5,
        text: "HTML & CSS concepts",
        completed: true,
      },
      {
        id: 6,
        text: "Common interview questions",
        completed: true,
      },
    ],
  },
];


const toolkitItems = [
  {
    id: 1,
    title: "Company Research",
    icon: <Building2 size={25} />,
  },
  {
    id: 2,
    title: "Common Questions",
    icon: <MessageCircleQuestion size={25} />,
  },
  {
    id: 3,
    title: "Mock Interview",
    icon: <Video size={25} />,
  },
  {
    id: 4,
    title: "Coding Practice",
    icon: <Code2 size={25} />,
  },
  {
    id: 5,
    title: "My Notes",
    icon: <NotebookPen size={25} />,
  },
];


const padNumber = (number) =>
  String(number).padStart(2, "0");


const toDateKey = (date) =>
  `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(
    date.getDate()
  )}`;


const getInterviewDate = (interview) => {
  if (!interview?.date) {
    return null;
  }

  const date = new Date(`${interview.date}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? null
    : date;
};


const formatClockTime = (value) => {
  if (!value) {
    return "";
  }

  const [hours, minutes] = value.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};


const getInterviewTimeLabel = (interview) => {
  if (interview?.time) {
    return interview.time;
  }

  const start = formatClockTime(interview?.startTime);
  const end = formatClockTime(interview?.endTime);

  if (start && end) {
    return `${start} – ${end}`;
  }

  return start || "Time not set";
};


const getRemainingLabel = (interview) => {
  const interviewDate = getInterviewDate(interview);

  if (!interviewDate) {
    return "Date not set";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(interviewDate);
  target.setHours(0, 0, 0, 0);

  const difference = Math.ceil(
    (target - today) / (1000 * 60 * 60 * 24)
  );

  if (difference < 0) {
    return "Past";
  }

  if (difference === 0) {
    return "Today";
  }

  if (difference === 1) {
    return "Tomorrow";
  }

  return `${difference} days left`;
};


function InterviewLogo({ company = "?" }) {
  const initial =
    company.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className="interview-logo interview-logo-initial"
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}


function Calendar({
  interviews,
  selectedInterview,
  onSelectInterview,
}) {
  const selectedDate =
    getInterviewDate(selectedInterview);

  const startingDate =
    selectedDate || new Date();

  const [visibleMonth, setVisibleMonth] =
    useState(
      new Date(
        startingDate.getFullYear(),
        startingDate.getMonth(),
        1
      )
    );

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const firstDayIndex =
    new Date(year, month, 1).getDay();

  const daysInMonth =
    new Date(year, month + 1, 0).getDate();

  const daysInPreviousMonth =
    new Date(year, month, 0).getDate();

  const calendarDays = [];

  for (let index = firstDayIndex - 1; index >= 0; index--) {
    calendarDays.push({
      day: daysInPreviousMonth - index,
      muted: true,
      date: new Date(
        year,
        month - 1,
        daysInPreviousMonth - index
      ),
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      muted: false,
      date: new Date(year, month, day),
    });
  }

  let nextMonthDay = 1;

  while (calendarDays.length < 42) {
    calendarDays.push({
      day: nextMonthDay,
      muted: true,
      date: new Date(year, month + 1, nextMonthDay),
    });

    nextMonthDay += 1;
  }

  const todayKey = toDateKey(new Date());

  const interviewDateMap =
    interviews.reduce((map, interview) => {
      if (!interview.date) {
        return map;
      }

      if (!map[interview.date]) {
        map[interview.date] = [];
      }

      map[interview.date].push(interview);

      return map;
    }, {});

  const selectedDateKey =
    selectedInterview?.date || "";

  const changeMonth = (amount) => {
    setVisibleMonth(
      new Date(year, month + amount, 1)
    );
  };

  return (
    <section className="calendar-card">
      <header>
        <h2>
          {visibleMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <div>
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            aria-label="Next month"
            onClick={() => changeMonth(1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </header>

      <div className="calendar-weekdays">
        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="calendar-days">
        {calendarDays.map((date, index) => {
          const dateKey = toDateKey(date.date);

          const dayInterviews =
            interviewDateMap[dateKey] || [];

          const classNames = [
            date.muted ? "muted" : "",
            dateKey === selectedDateKey
              ? "selected"
              : "",
            dateKey === todayKey
              ? "today"
              : "",
            dayInterviews.length > 0
              ? "has-interview"
              : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              type="button"
              className={classNames}
              key={`${dateKey}-${index}`}
              onClick={() => {
                if (dayInterviews.length > 0) {
                  onSelectInterview(
                    dayInterviews[0].id
                  );
                }
              }}
            >
              {date.day}
            </button>
          );
        })}
      </div>

      <footer className="calendar-legend">
        <span>
          <i className="legend-interview" />
          Interview
        </span>

        <span>
          <i className="legend-today" />
          Today
        </span>

        <span>
          <i className="legend-event" />
          Other event
        </span>
      </footer>
    </section>
  );
}


function UpcomingInterviews({
  interviews,
  selectedInterviewId,
  onSelectInterview,
  onOpenAddInterview,
}) {
  return (
    <section className="upcoming-interview-card">
      <header className="interview-section-header">
        <h2>Upcoming Interviews</h2>

        <span className="interview-count">
          {interviews.length}
        </span>
      </header>

      {interviews.length > 0 ? (
        <div className="interview-timeline">
          {interviews.map((interview) => {
            const interviewDate =
              getInterviewDate(interview);

            const month = interviewDate
              ? interviewDate
                  .toLocaleDateString("en-US", {
                    month: "short",
                  })
                  .toUpperCase()
              : "TBD";

            const day = interviewDate
              ? padNumber(interviewDate.getDate())
              : "--";

            return (
              <button
                type="button"
                className={
                  interview.id ===
                  selectedInterviewId
                    ? "interview-event selected"
                    : "interview-event"
                }
                key={interview.id}
                onClick={() =>
                  onSelectInterview(interview.id)
                }
              >
                <div className="interview-date">
                  <span>{month}</span>
                  <strong>{day}</strong>
                </div>

                <InterviewLogo
                  company={interview.company}
                />

                <div className="interview-event-information">
                  <h3>{interview.company}</h3>
                  <p>{interview.role}</p>

                  <div className="interview-badges">
                    <span>
                      {interview.round ||
                        "Interview Round"}
                    </span>

                    <span>
                      {interview.type === "On-site" ? (
                        <MapPin size={11} />
                      ) : (
                        <Video size={11} />
                      )}
                      {interview.type ||
                        "Video Call"}
                    </span>
                  </div>

                  <div className="interview-time">
                    <span>
                      {getRemainingLabel(interview)}
                    </span>

                    <span>
                      <Clock3 size={12} />
                      {getInterviewTimeLabel(
                        interview
                      )}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="interviews-empty-state">
          <strong>
            No interviews scheduled yet.
          </strong>
          <span>
            Add one manually or schedule one from
            an application in Interview stage.
          </span>
        </div>
      )}

      <button
        type="button"
        className="add-interview-button"
        onClick={onOpenAddInterview}
      >
        <Plus size={16} />
        Add Interview Manually
      </button>
    </section>
  );
}


function LeftPreparationBanner() {
  return (
    <section className="left-preparation-banner">
      <div className="left-banner-copy">
        <span>Keep preparing</span>

        <h2>
          Practice today.
          <br />
          Perform better tomorrow.
        </h2>

        <p>
          Your next opportunity is closer than you
          think.
        </p>
      </div>

      <img
        src={leftBannerImage}
        alt="Woman preparing for an interview"
      />
    </section>
  );
}


function SelectedInterview({ selectedInterview }) {
  if (!selectedInterview) {
    return (
      <section className="selected-interview selected-interview-empty">
        <div>
          <h2>No interview selected</h2>
          <p>
            Schedule an interview to start preparing.
          </p>
        </div>
      </section>
    );
  }

  const interviewDate =
    getInterviewDate(selectedInterview);

  return (
    <section className="selected-interview">
      <InterviewLogo
        company={selectedInterview.company}
      />

      <div className="selected-interview-title">
        <h2>{selectedInterview.company}</h2>
        <p>{selectedInterview.role}</p>
      </div>

      <span className="selected-interview-badge">
        {selectedInterview.round ||
          "Interview Round"}
      </span>

      <span className="selected-interview-badge">
        {selectedInterview.type === "On-site" ? (
          <MapPin size={12} />
        ) : (
          <Video size={12} />
        )}

        {selectedInterview.type ||
          "Video Call"}
      </span>

      <div className="selected-interview-time">
        <strong>
          {interviewDate
            ? interviewDate.toLocaleDateString(
                "en-US",
                {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )
            : "Date not scheduled"}
        </strong>

        <span>
          {getInterviewTimeLabel(
            selectedInterview
          )}
        </span>
      </div>

      <span className="days-left-badge">
        {getRemainingLabel(selectedInterview)}
      </span>
    </section>
  );
}


function InterviewTabs({
  activeTab,
  setActiveTab,
  selectedInterview,
  onMarkDone,
}) {
  const tabs = [
    "Preparation",
    "Company",
    "Questions",
    "Notes",
    "Resources",
  ];

  return (
    <nav className="interview-tabs">
      {tabs.map((tab) => (
        <button
          type="button"
          className={
            activeTab === tab ? "active" : ""
          }
          key={tab}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}

      <span className="interview-tab-spacer" />

      <button
        type="button"
        aria-label="Save interview"
      >
        <Bookmark size={18} />
      </button>

      <button
        type="button"
        className="mark-done-button"
        disabled={!selectedInterview}
        onClick={onMarkDone}
      >
        {selectedInterview?.completed
          ? "Completed"
          : "Mark as Done"}
      </button>

      <button
        type="button"
        aria-label="More options"
      >
        <MoreHorizontal size={18} />
      </button>
    </nav>
  );
}


function PreparationBoard() {
  const [columns, setColumns] =
    useState(preparationColumns);

  const [addingToColumn, setAddingToColumn] =
    useState(null);

  const [newTaskText, setNewTaskText] =
    useState("");

  const allTasks = columns.flatMap(
    (column) => column.tasks
  );

  const completedTasks = allTasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = allTasks.length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  const toggleTask = (columnId, taskId) => {
    setColumns((currentColumns) =>
      currentColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: column.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      completed:
                        !task.completed,
                    }
                  : task
              ),
            }
          : column
      )
    );
  };

  const startAddingTask = (columnId) => {
    setAddingToColumn(columnId);
    setNewTaskText("");
  };

  const cancelAddingTask = () => {
    setAddingToColumn(null);
    setNewTaskText("");
  };

  const addTask = (columnId) => {
    const taskText = newTaskText.trim();

    if (!taskText) {
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };

    setColumns((currentColumns) =>
      currentColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: [
                ...column.tasks,
                newTask,
              ],
            }
          : column
      )
    );

    cancelAddingTask();
  };

  return (
    <section className="preparation-board">
      <header className="preparation-heading">
        <div>
          <h2>Preparation Progress</h2>

          <p>
            {completedTasks}/{totalTasks} completed
          </p>
        </div>

        <strong>{progress}%</strong>
      </header>

      <div className="preparation-progress">
        <span
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="preparation-columns">
        {columns.map((column) => (
          <article
            className={`preparation-column ${column.tone}`}
            key={column.id}
          >
            <header>
              <h3>{column.title}</h3>
              <span>{column.tasks.length}</span>
            </header>

            <div className="preparation-tasks">
              {column.tasks.map((task) => (
                <label
                  className={
                    task.completed
                      ? "preparation-task completed"
                      : "preparation-task"
                  }
                  key={task.id}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      toggleTask(
                        column.id,
                        task.id
                      )
                    }
                  />

                  <span className="custom-checkbox">
                    {task.completed && (
                      <Check size={12} />
                    )}
                  </span>

                  <span>{task.text}</span>
                </label>
              ))}
            </div>

            {addingToColumn === column.id ? (
              <div className="add-task-form">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(event) =>
                    setNewTaskText(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      addTask(column.id);
                    }

                    if (event.key === "Escape") {
                      cancelAddingTask();
                    }
                  }}
                  placeholder={`Add to ${column.title}`}
                  autoFocus
                />

                <div>
                  <button
                    type="button"
                    className="save-task-button"
                    onClick={() =>
                      addTask(column.id)
                    }
                  >
                    Add
                  </button>

                  <button
                    type="button"
                    className="cancel-task-button"
                    onClick={cancelAddingTask}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="add-task-button"
                onClick={() =>
                  startAddingTask(column.id)
                }
              >
                <Plus size={14} />
                Add item
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function TabContent({
  activeTab,
  selectedInterview,
}) {
  if (activeTab === "Preparation") {
    return <PreparationBoard />;
  }

  const content = {
    Company: {
      title: "Company Research",
      body: selectedInterview
        ? `Keep your research for ${selectedInterview.company} here.`
        : "Select an interview to start company research.",
    },
    Questions: {
      title: "Interview Questions",
      body: "Keep likely technical, behavioral and role-specific questions here.",
    },
    Notes: {
      title: "Interview Notes",
      body: "Store notes, reminders and talking points for this interview.",
    },
    Resources: {
      title: "Interview Resources",
      body: "Save helpful links, documents and practice resources here.",
    },
  };

  const current = content[activeTab];

  return (
    <section className="interview-tab-content">
      <h2>{current.title}</h2>
      <p>{current.body}</p>
    </section>
  );
}


function decodeHtml(value = "") {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

const commonInterviewQuestions = [
  { category: "HTML", question: "What is semantic HTML and why is it important?", answer: "Semantic HTML uses meaningful elements such as header, nav, main, section and article. It improves accessibility, SEO and code readability." },
  { category: "CSS", question: "What is the difference between Flexbox and CSS Grid?", answer: "Flexbox is mainly one-dimensional, while Grid is designed for two-dimensional rows and columns." },
  { category: "JavaScript", question: "What is the difference between let, const and var?", answer: "let and const are block scoped. const cannot be reassigned. var is function scoped and is hoisted differently." },
  { category: "JavaScript", question: "What is event bubbling?", answer: "An event starts on the target element and then bubbles upward through its parent elements unless propagation is stopped." },
  { category: "React", question: "What is the difference between props and state?", answer: "Props are values passed into a component. State is data owned and updated by the component." },
  { category: "React", question: "What does useEffect do?", answer: "useEffect runs side effects after rendering, such as fetching data, timers, subscriptions or synchronizing with external systems." },
  { category: "API", question: "How do you fetch API data in JavaScript?", answer: "Use fetch(), check the response, convert it to JSON and handle loading and error states, usually with async/await or promises." },
  { category: "Behavioral", question: "Tell me about a project you built and a problem you solved.", answer: "Use a short STAR-style answer: project goal, your responsibility, the problem, what you did and the result." },
];

function ToolkitModal({ title, onClose, children, wide = false }) {
  return (
    <div className="toolkit-modal-backdrop" onMouseDown={onClose}>
      <section
        className={`toolkit-modal ${wide ? "wide" : ""}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="toolkit-modal-header">
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={19} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function CompanyResearchPanel() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All locations");

  useEffect(() => {
    fetch("https://www.arbeitnow.com/api/job-board-api")
      .then((response) => {
        if (!response.ok) throw new Error("Could not load companies.");
        return response.json();
      })
      .then((data) => setJobs(data.data || []))
      .catch(() => setError("Could not load company data right now."))
      .finally(() => setLoading(false));
  }, []);

  const locations = useMemo(() => [
    "All locations",
    ...new Set(jobs.map((job) => job.remote ? "Remote" : job.location).filter(Boolean)),
  ].slice(0, 35), [jobs]);

  const companies = useMemo(() => {
    const map = new Map();
    jobs.forEach((job) => {
      const company = job.company_name || "Company not listed";
      const jobLocation = job.remote ? "Remote" : job.location || "Location not listed";
      if (location !== "All locations" && !jobLocation.toLowerCase().includes(location.toLowerCase())) return;
      if (search && !`${company} ${job.title} ${jobLocation}`.toLowerCase().includes(search.toLowerCase())) return;
      if (!map.has(company)) map.set(company, { name: company, jobs: [], locations: new Set() });
      map.get(company).jobs.push(job);
      map.get(company).locations.add(jobLocation);
    });
    return [...map.values()].slice(0, 40);
  }, [jobs, search, location]);

  return <div className="toolkit-panel-body">
    <div className="toolkit-filter-row">
      <label className="toolkit-search"><Search size={16}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search company or role..."/></label>
      <select value={location} onChange={(e)=>setLocation(e.target.value)}>{locations.map((item)=><option key={item}>{item}</option>)}</select>
    </div>
    {loading && <div className="toolkit-state">Loading live companies...</div>}
    {error && <div className="toolkit-state error">{error}</div>}
    {!loading && !error && <div className="company-research-grid">
      {companies.map((company)=><article className="company-research-card" key={company.name}>
        <div className="company-research-icon"><Building2 size={19}/></div>
        <div><h3>{company.name}</h3><p>{[...company.locations].slice(0,2).join(" • ")}</p><span>{company.jobs.length} available job{company.jobs.length===1?"":"s"}</span></div>
        <a href={company.jobs[0]?.url} target="_blank" rel="noreferrer">View job</a>
      </article>)}
      {companies.length===0 && <div className="toolkit-state">No matching companies found.</div>}
    </div>}
  </div>;
}

function CommonQuestionsPanel() {
  const [category, setCategory] = useState("All");
  const [revealed, setRevealed] = useState([]);
  const categories = ["All", ...new Set(commonInterviewQuestions.map((item)=>item.category))];
  const questions = category === "All" ? commonInterviewQuestions : commonInterviewQuestions.filter((item)=>item.category===category);
  return <div className="toolkit-panel-body">
    <div className="question-category-row">{categories.map((item)=><button type="button" className={category===item?"active":""} onClick={()=>setCategory(item)} key={item}>{item}</button>)}</div>
    <div className="common-question-list">{questions.map((item,index)=>{
      const key=`${item.category}-${item.question}`; const open=revealed.includes(key);
      return <article className="common-question-card" key={key}><span>{item.category}</span><h3>{item.question}</h3><button type="button" onClick={()=>setRevealed((current)=>open?current.filter((x)=>x!==key):[...current,key])}><Eye size={14}/>{open?"Hide answer":"Show answer"}</button>{open&&<p>{item.answer}</p>}</article>;
    })}</div>
  </div>;
}

function ApiPracticePanel({ mode }) {
  const [difficulty, setDifficulty] = useState("easy");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadQuestions = async () => {
    setLoading(true); setError(""); setShowAnswer(false);
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=10&category=18&difficulty=${difficulty}&type=multiple`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!data.results?.length) throw new Error();
      setQuestions(data.results); setIndex(0);
    } catch { setError("The practice API could not load questions. Try again in a moment."); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ loadQuestions(); }, [difficulty]);
  const question=questions[index];
  const next=()=>{ if(!questions.length)return; setIndex((current)=>(current+1)%questions.length); setShowAnswer(false); };

  return <div className="toolkit-panel-body api-practice-panel">
    <div className="practice-controls"><div><strong>{mode === "mock" ? "Technical Mock Interview" : "Coding & Computer Science Practice"}</strong><p>Live questions fetched from the Computer Science question API.</p></div><select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
    {loading&&<div className="toolkit-state">Fetching a fresh question set...</div>}
    {error&&<div className="toolkit-state error">{error}<button type="button" onClick={loadQuestions}>Try again</button></div>}
    {!loading&&!error&&question&&<article className="practice-question-card"><span>Question {index+1} of {questions.length}</span><h3>{decodeHtml(question.question)}</h3>{mode==="mock"&&<textarea placeholder="Type how you would answer this in an interview..."/>}{showAnswer&&<div className="practice-answer"><strong>Answer</strong><p>{decodeHtml(question.correct_answer)}</p></div>}<div className="practice-question-actions"><button type="button" onClick={()=>setShowAnswer((v)=>!v)}>{showAnswer?"Hide answer":"Reveal answer"}</button><button type="button" className="primary" onClick={next}>Next question <ChevronRight size={15}/></button></div></article>}
  </div>;
}

function NotesPanel({ notes, setNotes }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const saveNote = (event) => {
    event.preventDefault();
    if (!body.trim()) return;
    setNotes((current)=>[{id:Date.now(), title:title.trim()||"Interview Note", body:body.trim(), createdAt:Date.now()}, ...current]);
    setTitle(""); setBody("");
  };
  return <div className="toolkit-panel-body notes-workspace">
    <form className="sticky-note-editor" onSubmit={saveNote}><input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Note title"/><textarea value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Write something you want to remember..."/><button type="submit">Save Note</button></form>
    <div className="saved-note-list">{notes.map((note)=><article className="saved-note-card" key={note.id}><div><h3>{note.title}</h3><small>{new Date(note.createdAt).toLocaleDateString()}</small></div><p>{note.body}</p><button type="button" onClick={()=>setNotes((current)=>current.filter((item)=>item.id!==note.id))} aria-label="Delete note"><Trash2 size={15}/></button></article>)}{notes.length===0&&<div className="toolkit-state">No notes saved yet.</div>}</div>
  </div>;
}

function InterviewToolkit({ notes, setNotes }) {
  const [openTool, setOpenTool] = useState(null);
  const titles = { company:"Company Research", questions:"Common Interview Questions", mock:"Mock Interview", coding:"Coding Practice", notes:"My Notes" };
  const toolKey = { "Company Research":"company", "Common Questions":"questions", "Mock Interview":"mock", "Coding Practice":"coding", "My Notes":"notes" };
  return <>
    <section className="interview-toolkit"><h2>Interview Toolkit</h2><div className="toolkit-grid">{toolkitItems.map((item)=><button type="button" key={item.id} onClick={()=>setOpenTool(toolKey[item.title])}>{item.icon}<span>{item.title}</span></button>)}</div></section>
    {openTool&&<ToolkitModal title={titles[openTool]} onClose={()=>setOpenTool(null)} wide={openTool!=="notes"}>
      {openTool==="company"&&<CompanyResearchPanel/>}
      {openTool==="questions"&&<CommonQuestionsPanel/>}
      {openTool==="mock"&&<ApiPracticePanel mode="mock"/>}
      {openTool==="coding"&&<ApiPracticePanel mode="coding"/>}
      {openTool==="notes"&&<NotesPanel notes={notes} setNotes={setNotes}/>} 
    </ToolkitModal>}
  </>;
}

function InterviewBottomSection({ notes, onViewAll }) {
  const latestNote = notes[0];
  return (
    <>
      <div className="interview-bottom-grid">
        <section className="interview-notes">
          <header><h2><FileText size={18}/>My Notes</h2><button type="button" onClick={onViewAll}>View all <ChevronRight size={14}/></button></header>
          <div className="interview-note-content">
            {latestNote ? <><strong>{latestNote.title}</strong><p>{latestNote.body}</p><small>Saved {new Date(latestNote.createdAt).toLocaleDateString()}</small></> : <><p>No notes yet. Use My Notes in the toolkit to save your first interview note.</p><small>Your latest note will appear here.</small></>}
          </div>
        </section>
        <section className="confidence-card"><header><h2><Target size={18}/>Confidence Meter</h2><p>How prepared do you feel?</p></header><div className="confidence-progress"><span/><i/></div><div className="confidence-labels"><span>Not ready</span><span>Somewhat</span><span>Confident</span><span>Very ready</span></div></section>
      </div>
      <blockquote className="interview-quote">“Preparation today leads to the opportunities of tomorrow.”<span>💜</span></blockquote>
    </>
  );
}


function AddInterviewModal({
  applications,
  newInterview,
  setNewInterview,
  onClose,
  onSubmit,
}) {
  const interviewApplications =
    applications.filter(
      (application) =>
        application.status === "Interview"
    );

  const handleApplicationSelection = (
    event
  ) => {
    const applicationId = event.target.value;

    if (!applicationId) {
      setNewInterview((current) => ({
        ...current,
        applicationId: "",
      }));
      return;
    }

    const application =
      interviewApplications.find(
        (item) =>
          String(item.id) ===
          String(applicationId)
      );

    setNewInterview((current) => ({
      ...current,
      applicationId,
      company: application?.company || "",
      role: application?.role || "",
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setNewInterview((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <div
      className="interview-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="interview-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-interview-title"
      >
        <div className="interview-modal-header">
          <div>
            <h2 id="schedule-interview-title">
              Schedule Interview
            </h2>

            <p>
              Add the interview details and HireFlow
              will track it for you.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close schedule interview"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="interview-form"
          onSubmit={onSubmit}
        >
          {interviewApplications.length > 0 && (
            <label className="interview-form-full">
              <span>
                Choose an Interview-stage application
              </span>

              <select
                value={
                  newInterview.applicationId
                }
                onChange={
                  handleApplicationSelection
                }
              >
                <option value="">
                  Select application
                </option>

                {interviewApplications.map(
                  (application) => (
                    <option
                      key={application.id}
                      value={application.id}
                    >
                      {application.company} —{" "}
                      {application.role}
                    </option>
                  )
                )}
              </select>
            </label>
          )}

          <label>
            <span>Company *</span>

            <input
              type="text"
              name="company"
              value={newInterview.company}
              onChange={handleChange}
              placeholder="e.g. Microsoft"
              required
            />
          </label>

          <label>
            <span>Job role *</span>

            <input
              type="text"
              name="role"
              value={newInterview.role}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              required
            />
          </label>

          <label>
            <span>Interview date *</span>

            <input
              type="date"
              name="date"
              value={newInterview.date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Round</span>

            <select
              name="round"
              value={newInterview.round}
              onChange={handleChange}
            >
              <option value="Technical Round">
                Technical Round
              </option>
              <option value="HR Interview">
                HR Interview
              </option>
              <option value="Manager Round">
                Manager Round
              </option>
              <option value="Final Round">
                Final Round
              </option>
            </select>
          </label>

          <label>
            <span>Start time *</span>

            <input
              type="time"
              name="startTime"
              value={newInterview.startTime}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>End time</span>

            <input
              type="time"
              name="endTime"
              value={newInterview.endTime}
              onChange={handleChange}
            />
          </label>

          <label className="interview-form-full">
            <span>Interview mode</span>

            <select
              name="type"
              value={newInterview.type}
              onChange={handleChange}
            >
              <option value="Video Call">
                Video Call
              </option>
              <option value="Phone Call">
                Phone Call
              </option>
              <option value="On-site">
                On-site
              </option>
            </select>
          </label>

          <div className="interview-form-actions interview-form-full">
            <button
              type="button"
              className="cancel-interview-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-interview-button"
            >
              <Plus size={16} />
              Schedule Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function Interviews({
  applications = [],
  setApplications,
  interviews = [],
  setInterviews,
  userSession,
}) {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedInterviewId, setSelectedInterviewId] =
    useState(
      interviews.length > 0
        ? interviews[0].id
        : null
    );

  const [showAddInterview, setShowAddInterview] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState("Preparation");

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("hireflowInterviewNotes");
    return saved ? JSON.parse(saved) : [];
  });

  const [showAllNotes, setShowAllNotes] = useState(false);

  useEffect(() => {
    localStorage.setItem("hireflowInterviewNotes", JSON.stringify(notes));
  }, [notes]);

  const [newInterview, setNewInterview] =
    useState({
      applicationId: "",
      company: "",
      role: "",
      date: "",
      round: "Technical Round",
      startTime: "10:00",
      endTime: "11:00",
      type: "Video Call",
    });

  const filteredInterviews = useMemo(() => {
    const term =
      searchTerm.trim().toLowerCase();

    return [...interviews]
      .filter((interview) => {
        if (!term) {
          return true;
        }

        return [
          interview.company,
          interview.role,
          interview.round,
          interview.type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      })
      .sort((first, second) => {
        const firstDate =
          getInterviewDate(first)?.getTime() ||
          Number.MAX_SAFE_INTEGER;

        const secondDate =
          getInterviewDate(second)?.getTime() ||
          Number.MAX_SAFE_INTEGER;

        return firstDate - secondDate;
      });
  }, [interviews, searchTerm]);

  const selectedInterview =
    interviews.find(
      (interview) =>
        interview.id === selectedInterviewId
    ) ||
    filteredInterviews[0] ||
    null;

  const selectInterview = (id) => {
    setSelectedInterviewId(id);
    setActiveTab("Preparation");
  };

  const closeAddInterview = () => {
    setShowAddInterview(false);

    setNewInterview({
      applicationId: "",
      company: "",
      role: "",
      date: "",
      round: "Technical Round",
      startTime: "10:00",
      endTime: "11:00",
      type: "Video Call",
    });
  };

  const handleAddInterview = (event) => {
    event.preventDefault();

    if (
      !newInterview.company.trim() ||
      !newInterview.role.trim() ||
      !newInterview.date ||
      !newInterview.startTime
    ) {
      return;
    }

    const id = Date.now();

    const interview = {
      id,
      applicationId:
        newInterview.applicationId || null,
      company: newInterview.company.trim(),
      role: newInterview.role.trim(),
      date: newInterview.date,
      round: newInterview.round,
      startTime: newInterview.startTime,
      endTime: newInterview.endTime,
      type: newInterview.type,
      completed: false,
      createdAt: Date.now(),
    };

    setInterviews((current) => [
      ...current,
      interview,
    ]);

    if (
      newInterview.applicationId &&
      typeof setApplications === "function"
    ) {
      setApplications((current) =>
        current.map((application) =>
          String(application.id) ===
          String(
            newInterview.applicationId
          )
            ? {
                ...application,
                status: "Interview",
                nextAction:
                  newInterview.round,
                nextDate:
                  newInterview.date,
              }
            : application
        )
      );
    }

    setSelectedInterviewId(id);
    closeAddInterview();
  };

  const markSelectedInterviewDone = () => {
    if (!selectedInterview) {
      return;
    }

    setInterviews((current) =>
      current.map((interview) =>
        interview.id === selectedInterview.id
          ? {
              ...interview,
              completed: true,
            }
          : interview
      )
    );
  };

  return (
    <section className="interviews-page">
      <header className="interviews-header">
        <div>
          <h1>Interviews</h1>

          <p>
            Your personal interview preparation
            workspace.
          </p>
        </div>

        <div className="interviews-header-actions">
          <label className="interviews-search">
            <Search size={18} />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search interviews, companies..."
            />
          </label>

          <button
            type="button"
            className="interviews-notification"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span />
          </button>

          {userSession && (
            <>
              <div className="interviews-avatar">
                {userSession.name?.trim().charAt(0).toUpperCase()}
              </div>

              <div className="interviews-user">
                <strong>
                  Hi, {userSession.name?.trim().split(" ")[0]}!
                </strong>
                <span>⌄</span>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="interviews-layout">
        <aside className="interviews-left-column">
          <Calendar
            interviews={filteredInterviews}
            selectedInterview={
              selectedInterview
            }
            onSelectInterview={
              selectInterview
            }
          />

          <UpcomingInterviews
            interviews={filteredInterviews}
            selectedInterviewId={
              selectedInterview?.id
            }
            onSelectInterview={
              selectInterview
            }
            onOpenAddInterview={() =>
              setShowAddInterview(true)
            }
          />

          <LeftPreparationBanner />
        </aside>

        <main className="interview-workspace">
          <SelectedInterview
            selectedInterview={
              selectedInterview
            }
          />

          <InterviewTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedInterview={
              selectedInterview
            }
            onMarkDone={
              markSelectedInterviewDone
            }
          />

          <TabContent
            activeTab={activeTab}
            selectedInterview={
              selectedInterview
            }
          />

          <InterviewToolkit
            notes={notes}
            setNotes={setNotes}
          />

          <InterviewBottomSection
            notes={notes}
            onViewAll={() => setShowAllNotes(true)}
          />
        </main>
      </div>

      {showAllNotes && (
        <ToolkitModal
          title="All Saved Notes"
          onClose={() => setShowAllNotes(false)}
        >
          <NotesPanel notes={notes} setNotes={setNotes} />
        </ToolkitModal>
      )}

      {showAddInterview && (
        <AddInterviewModal
          applications={applications}
          newInterview={newInterview}
          setNewInterview={setNewInterview}
          onClose={closeAddInterview}
          onSubmit={handleAddInterview}
        />
      )}
    </section>
  );
}


export default Interviews;
