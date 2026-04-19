# SpendWise

**SpendWise** is a full-stack expense management web application designed for organizations and teams to submit, track, and analyze expenses in real time. It features a dual-role architecture — a user-facing submission and tracking interface alongside a comprehensive admin analytics dashboard.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Database Design](#database-design)
- [Scripts](#scripts)

---

## Overview

SpendWise provides a streamlined workflow for expense reporting within an organization. Users can log expenses under specific events, attach bill images, and monitor approval statuses. Administrators have access to aggregated analytics, per-event breakdowns, and full control over expense records.

The project was built as a Full Stack Development Lab (FSDL) project and intentionally demonstrates advanced MongoDB features including aggregation pipelines, compound indexing, and dynamic query construction.

---

## Features

### User Interface
- Expense submission form with event selection, category tagging, amount, date, and mandatory bill upload (base64 encoded)
- Character-limited description field with live word counter
- Personal expense dashboard with real-time status tracking (Pending / Approved / Rejected)
- Detailed expense view with bill preview
- Light/Dark theme toggle

### Admin Dashboard
- Aggregate statistics: total spending, highest expense, average spend, total transactions
- Category-wise and spender-wise spending breakdown
- Expense status funnel (Pending / Approved / Rejected counts)
- Event management panel for creating and listing events
- Full expense list with approval/rejection controls and delete functionality
- Advanced filtering: search by keyword, filter by category, filter by date range, sort by amount or date

### Landing Page
- Hero section with branding
- Features overview section
- Interactive story section
- Footer

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool and dev server |
| Axios | HTTP client for API calls |
| Vanilla CSS | Styling with dark/light theme support |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express 5 | REST API framework |
| Mongoose 9 | MongoDB ODM |
| CORS | Cross-origin request handling |

### Database
| Technology | Purpose |
|---|---|
| MongoDB (local) | Primary data store |
| Mongoose Aggregation Pipelines | Statistics and analytics |
| Mongoose Indexing | Query performance optimization |

---

## Project Structure

```
SPENDWISE_FSD/
├── backend/
│   ├── models/
│   │   ├── Expense.js          # Expense schema with indexing
│   │   └── Event.js            # Event schema
│   └── server.js               # Express server with all API routes
├── src/
│   ├── components/
│   │   ├── hero.jsx            # Landing page hero section
│   │   ├── features.jsx        # Features overview section
│   │   ├── Story.jsx           # Interactive story section
│   │   ├── navbar.jsx          # Top navigation bar
│   │   └── footer.jsx          # Footer
│   │   └── user_dashboard/
│   │       ├── UserDashboard.jsx
│   │       ├── ExpenseForm.jsx         # Expense submission form
│   │       ├── ExpenseDashboard.jsx    # Personal expense list view
│   │       ├── ExpenseDetailView.jsx   # Single expense detail/bill view
│   │       ├── ExpenseList.jsx
│   │       ├── SummaryCards.jsx
│   │       ├── Sidebar.jsx
│   │       ├── DashboardNavbar.jsx
│   │       └── FeatureButtons.jsx
│   ├── dashboard/
│   │   ├── AdminDashboard.jsx          # Admin expense management
│   │   ├── AdminAnalytics.jsx          # Charts and aggregate stats
│   │   └── AdminEvents.jsx             # Event creation and listing
│   ├── login/
│   │   └── Login.jsx                   # Login page
│   ├── App.jsx                         # Root component and routing
│   └── main.jsx                        # React entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd SPENDWISE_FSD
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   cd ..
   ```

### Running the Application

1. **Start MongoDB** — Ensure MongoDB is running locally on `mongodb://127.0.0.1:27017`.

2. **Start the backend server**

   ```bash
   cd backend
   node server.js
   ```

   The API server starts on `http://localhost:5000`.

3. **Start the frontend dev server**

   ```bash
   npm run dev
   ```

   The app opens at `http://localhost:5173` (or the next available port).

---

## API Reference

All routes are prefixed with `/api`.

### Events

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/events` | Create a new event |
| `GET` | `/api/events` | Get all events (sorted by newest) |

### Expenses

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/expenses` | Submit a new expense |
| `GET` | `/api/expenses` | Get expenses with optional filters |
| `GET` | `/api/expenses/stats` | Get aggregated statistics |
| `PUT` | `/api/expenses/:id/status` | Update expense approval status |
| `DELETE` | `/api/expenses/:id` | Delete an expense by ID |

#### Query Parameters for `GET /api/expenses`

| Parameter | Type | Description |
|---|---|---|
| `search` | string | Full-text search across event and category fields (`$regex`) |
| `category` | string | Filter by category (exact match) |
| `startDate` | string | Filter expenses on or after this date (`$gte`) |
| `endDate` | string | Filter expenses on or before this date (`$lte`) |
| `sort` | string | Sort order: `newest` (default), `oldest`, `highest`, `lowest` |

---

## Database Design

### Expense Schema

| Field | Type | Required | Notes |
|---|---|---|---|
| `event` | String | Yes | Event the expense belongs to |
| `amount` | Number | Yes | Expense amount |
| `category` | String | Yes | Expense category |
| `date` | String | Yes | Date of expense |
| `description` | String | No | Optional description (character limited in UI) |
| `status` | String | No | `pending` / `approved` / `rejected` (default: `pending`) |
| `submittedBy` | String | No | Name of the submitting user |
| `billFile` | String | Yes | Base64-encoded bill image |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

**Indexes applied for performance:**
- `category` — ascending index for category filter queries
- `date` — descending index for date-sorted queries
- `event` — text index for full-text search

### Aggregation Pipelines (used in `/api/expenses/stats`)

- **Overall stats** — `$group` with `$sum`, `$max`, `$avg` for total, highest, and average spend
- **Category breakdown** — `$group` by category + `$sort` + `$project`
- **Spenders breakdown** — `$group` by `submittedBy` + `$sort` + `$limit 10`
- **Status funnel** — `$group` by status with counts and amounts

---

## Scripts

### Frontend (`/`)

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Start Vite development server |
| Build | `npm run build` | Build for production |
| Preview | `npm run preview` | Preview production build locally |
| Lint | `npm run lint` | Run ESLint |

### Backend (`/backend`)

| Script | Command | Description |
|---|---|---|
| Start | `node server.js` | Start the Express API server |

---

## Notes

- Bill files are stored as base64 strings in MongoDB. For production use, consider migrating to a file storage service such as AWS S3 or Cloudinary.
- Authentication is handled through a simple login interface. For production deployment, integrate a proper authentication library and session management.
- MongoDB must be running locally before starting the backend server.
