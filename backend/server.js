require('dotenv').config();

const express = require("express");
const eventIngestRoute = require("./eventIngestRoute");
const insightsGapsRoute = require("./temporalGapsRoute");
const timelineRoute = require("./timelineRoute");
const searchRoute = require("./searchEventsRoute");
const insightsRoute = require("./insightsRoute");
const eventInfluenceRoute = require("./eventInfluenceRoute");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use("/api", eventIngestRoute);
app.use("/api", timelineRoute);
app.use("/api", searchRoute);
app.use("/api", insightsRoute);
app.use("/api", insightsGapsRoute);
app.use("/api", eventInfluenceRoute);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
