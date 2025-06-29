# ArchaeoData Backend API

This backend provides a set of RESTful APIs for ingesting, searching, analyzing, and visualizing historical event data.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
  - [1. Ingest Events](#1-ingest-events)
  - [2. Ingestion Status](#2-ingestion-status)
  - [3. Timeline by Root Event](#3-timeline-by-root-event)
  - [4. Search Events](#4-search-events)
  - [5. Overlapping Events Insight](#5-overlapping-events-insight)
  - [6. Temporal Gaps Insight](#6-temporal-gaps-insight)
  - [7. Event Influence Path](#7-event-influence-path)
- [Design Choices & Concepts](#design-choices--concepts)

---

## Setup Instructions

### 1. Dependencies

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (or your preferred SQL database)

### 2. Installation

Clone the repository and install dependencies:

```sh
git clone "add-git-link"
cd kelp-backend
npm install
```

### 3. Database Configuration

1. Create a PostgreSQL database (e.g., `archaeodata`).
2. Set up your `.env` file in the project root:

    ```
    DATABASE_URL=postgresql://username:password@localhost:5432/archaeodata
    PORT=3000
    ```

### 4. Running the Application

Start the server:

```sh
npm run dev
# or
npm start
```

The API will be available at `http://localhost:3000`.

---

## API Endpoints

To access and test the API endpoints easily, you can use the provided [Postman collection](./api.postman_collection.json).

### 1. Ingest Events

**POST** `/api/events/ingest`

- Upload a file of events for ingestion.
- Accepts `multipart/form-data` with a `file` field, or JSON with a `filePath`.

**Response:**
- `202 Accepted` with a `jobId` to track ingestion status.

---

### 2. Ingestion Status

**GET** `/api/events/ingestion-status/:jobId`

- Get the status of a previously submitted ingestion job.

**Response:**
- `200 OK` with job status, processed/error lines, and error details if any.

---

### 3. Timeline by Root Event

**GET** `/api/timeline/:rootEventId`

- Returns a tree of events starting from the given root event, including all descendants.

**Response:**
- `200 OK` with a nested JSON structure representing the event and its children.
- `404 Not Found` if the root event does not exist.

---

### 4. Search Events

**GET** `/api/events/search`

- Search for events by name and/or date range, with pagination and sorting.

**Query Parameters:**
- `name` (optional): Partial match on event name.
- `start_date_after` (optional): Only events starting after this ISO date.
- `end_date_before` (optional): Only events ending before this ISO date.
- `sortBy` (optional): `event_name`, `start_date`, or `end_date` (default: `start_date`).
- `sortOrder` (optional): `asc` or `desc` (default: `asc`).
- `page` (optional): Page number (default: 1).
- `limit` (optional): Results per page (default: 10).

**Response:**
- `200 OK` with total count and paginated list of events.

---

### 5. Overlapping Events Insight

**GET** `/api/insights/overlapping-events?startDate=...&endDate=...`

- Find pairs of events that overlap in time within the specified date range.

**Query Parameters:**
- `startDate` (required): ISO date string.
- `endDate` (required): ISO date string.

**Response:**
- `200 OK` with a list of overlapping event pairs and their overlap duration in minutes.

---

### 6. Temporal Gaps Insight

**GET** `/api/insights/temporal-gaps?startDate=...&endDate=...`

- Find the largest temporal gap (period with no events) within the specified date range.

**Query Parameters:**
- `startDate` (required): ISO date string.
- `endDate` (required): ISO date string.

**Response:**
- `200 OK` with details of the largest gap, or a message if no significant gap is found.

---

### 7. Event Influence Path

**GET** `/api/insights/event-influence?sourceEventId=...&targetEventId=...`

- Find the shortest path (by total duration) from a source event to a target event via parent-child relationships.

**Query Parameters:**
- `sourceEventId` (required): UUID of the source event.
- `targetEventId` (required): UUID of the target event.

**Response:**
- `200 OK` with the shortest path and total duration, or a message if no path exists.

---

## Design Choices & Concepts

### Data Model

- **Events** are stored with unique IDs, names, start/end dates, and parent-child relationships for hierarchical timelines.
- **Ingestion** supports both file uploads and direct file path references for flexibility.

### Asynchronous Ingestion

- Ingestion jobs are tracked by unique job IDs.
- Status endpoints allow clients to poll for progress and errors.

### Search & Filtering

- Search endpoint supports partial name matches, date range filtering, sorting, and pagination for efficient querying.

### Timeline & Hierarchy

- Timeline endpoint returns a nested tree structure, enabling visualization of event hierarchies.

### Insights

- **Overlapping Events:** Finds event pairs with overlapping timeframes.
- **Temporal Gaps:** Identifies periods with no events.
- **Influence Path:** Uses graph traversal to find the shortest path between events via parent-child links.

### Error Handling

- All endpoints return clear error messages and appropriate HTTP status codes.
- Ingestion errors are tracked per job and reported via the status endpoint.

### Extensibility

- Modular structure allows easy addition of new insights or data sources.
- Database-agnostic design (can swap PostgreSQL for another SQL DB with minimal changes).

---