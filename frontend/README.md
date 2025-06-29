# Kelp Assignment – Event Timeline React App

A modern React application (built with Vite and Tailwind CSS) for ingesting, searching, and visualizing historical event data. This app provides a user-friendly interface to interact with a backend API for event ingestion, timeline viewing, event search, overlapping/temporal gap insights, and influence path discovery.

---

## Features

- **Ingest Events:** Upload event files and track ingestion status.
- **Timeline Viewer:** Visualize event hierarchies by root event.
- **Search Events:** Search and filter events by name and date.
- **Overlapping Events:** Find events that overlap in a given date range.
- **Temporal Gaps:** Discover the largest gaps between events.
- **Influence Path:** Find the shortest influence path between two events.
- **Responsive UI:** Built with Tailwind CSS for a clean, modern look.

---

## Setup Instructions

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- Backend API running (see backend README for setup)

### 2. Clone the Repository

```sh
git clone <your-repo-url>
cd kelp/frontend
```

### 3. Install Dependencies

```sh
npm install
```

### 4. Tailwind CSS Setup

Tailwind is already configured. If you need to re-init, run:

```sh
npx tailwindcss init -p
```

Make sure `tailwind.config.js` includes:

```js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}
```

### 5. Environment Variables

If your backend API is not running on `http://localhost:3000`, you can set a custom API base URL using a Vite environment variable.

Create a `.env` file in the `frontend` directory with the following content:

```
VITE_API_URL=http://your-backend-url:3000
```

Make sure your `src/api/api.js` uses this variable, for example:

```js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
```

Restart the dev server after changing `.env` values.

### 6. Run the Application

```sh
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── api/           # API request helpers
│   ├── components/    # Navbar, Footer, etc.
│   ├── pages/         # Main UI pages (Ingest, Timeline, Search, etc.)
│   ├── App.jsx        # Main app component
│   ├── App.css        # Global styles (includes Tailwind)
│   └── main.jsx       # Entry point
├── tailwind.config.js
├── package.json
└── README.md
```

---

## Usage

- **Ingest Events:** Go to "Ingest Events", upload a file, and track the job status.
- **Timeline:** Enter a root event ID to view its timeline.
- **Search:** Search by event name or date.
- **Overlapping/Temporal Gaps:** Enter date ranges to get insights.
- **Influence Path:** Enter source and target event IDs to find the path.

---

## Customization

- **Styling:** All UI uses Tailwind CSS. Edit classes in JSX for custom look.
- **API:** Update `src/api/api.js` to match your backend endpoints if needed.

---

## Author

Made by Pratiksha Sankhe  
[Email](mailto:sankhepratiksha3@gmail.com) | [LinkedIn](https://www.linkedin.com/in/pratiksha-sankhe)

---