# HireFlow

A responsive job-search management dashboard built with React.

HireFlow helps job seekers organize applications, explore opportunities, save jobs, prepare for interviews, and understand their progress from one focused workspace. The project was created to turn the often scattered job-hunting process into a clear, visual workflow.

## Core Features

### Dashboard

- Overview cards for applications, interviews, offers, and rejections
- Application activity and status visualizations
- Recent applications
- Upcoming interview summary
- Personalized motivation panel

### Application Tracker

- Add new job applications
- Search by company, role, or location
- Filter by status, work mode, and job type
- Sort by date or company name
- Switch between list and board views
- Move applications through Applied, Screening, Interview, Offer, and Rejected stages
- View detailed application information
- Delete applications
- Persist application data in the browser

### Job Board

- Browse a curated job-board interface
- View recommended opportunities and match information
- Open individual job-detail routes
- Save and remove jobs
- Add jobs to the application pipeline

### Interview Management

- Track scheduled interviews
- Connect interviews with application data
- Mark interview progress
- Organize interview-related information in a dedicated workspace

### Analytics

- Application funnel and trend views
- Application, interview, response, and offer statistics
- Job-type and work-mode breakdowns
- Date-range filtering
- Performance tables
- Personalized insights based on tracked data
- Progress goals for applications, response rate, interviews, and offers

### Account Experience

- Registration and login interfaces
- Browser-based session persistence
- User profile dashboard
- Settings page
- Responsive sidebar and mobile navigation

## Built With

- React 19
- Vite
- React Router
- JavaScript and JSX
- CSS3
- Lucide React
- React Icons
- Recharts
- Browser localStorage
- Vercel SPA configuration

## Application Architecture

HireFlow uses shared state in the main application component for:

- Applications
- Saved jobs
- Interviews
- User session

That state is passed to routed pages through props and synchronized with localStorage through `useEffect`. This keeps the user's information available after refreshing the browser without requiring a backend database.

React Router provides separate views for:

| Route | Page |
| --- | --- |
| `/` | Dashboard |
| `/applications` | Application tracker |
| `/job-board` | Job board |
| `/job-details/:slug` | Job details |
| `/interviews` | Interview tracker |
| `/analytics` | Analytics |
| `/saved-jobs` | Saved jobs |
| `/profile` | User profile |
| `/settings` | Settings |
| `/login` | Login |
| `/register` | Registration |

## Project Structure

```text
HireFlow/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── applicationactivity.jsx
│   │   ├── applicationstatus.jsx
│   │   ├── header.jsx
│   │   ├── motivationbanner.jsx
│   │   ├── recentapplications.jsx
│   │   ├── sidebar.jsx
│   │   ├── statcards.jsx
│   │   └── upcominginterviews.jsx
│   ├── pages/
│   │   ├── Analytics.jsx
│   │   ├── Applications.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Interviews.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   ├── Savedjobs.jsx
│   │   ├── Settings.jsx
│   │   ├── jobboard.jsx
│   │   └── jobdetails.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── page-specific CSS files
├── package.json
├── vercel.json
└── vite.config.js
```

## Run Locally

```bash
git clone https://github.com/Shwetaleena-Kundu/HireFlow.git
cd HireFlow
npm install
npm run dev
```

Open the local URL shown by Vite.

## Production Build

```bash
npm run build
npm run preview
```

The included `vercel.json` rewrites requests to `index.html`, allowing React Router routes to work correctly when the project is deployed on Vercel.

## What I Learned

Building HireFlow helped me practise:

- Breaking a large interface into reusable React components
- Passing data and event handlers through props
- Managing interactive state with `useState`
- Synchronizing application data with `useEffect`
- Persisting structured data in localStorage
- Rendering lists and computed analytics from user data
- Creating dynamic routes with React Router
- Implementing search, filters, sorting, tabs, modals, and conditional rendering
- Building data visualizations and progress indicators
- Designing responsive dashboard layouts for desktop, tablet, and mobile
- Managing multiple interconnected pages in a single-page application

## Current Scope

HireFlow is a frontend portfolio application. Applications, saved jobs, interviews, and session data are stored locally in the user's browser. The job-board content and authentication flow demonstrate the intended product experience but are not connected to a production job API, backend authentication service, or cloud database.

## Planned Improvements

- Connect a live jobs API
- Add secure backend authentication
- Store user data in a database
- Add protected routes
- Support editing all application details
- Add calendar reminders and interview notifications
- Add data export and import
- Improve accessibility testing
- Add automated component and interaction tests

## Why This Project Matters

HireFlow demonstrates the ability to build more than a static landing page. It combines routing, reusable components, forms, state management, persistence, responsive design, derived analytics, and multiple connected workflows in one React application.

It also solves a practical problem: helping job seekers replace scattered notes and spreadsheets with a structured application pipeline.

## Author

**Shwetaleena Kundu**

- GitHub: [@Shwetaleena-Kundu](https://github.com/Shwetaleena-Kundu)
