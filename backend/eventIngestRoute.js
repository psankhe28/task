const express = require("express");
const router = express.Router();
const jobStore = require("./jobStore");
const ingestFile = require("./ingestWorker");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { Client } = require("pg");

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
db.connect();

const upload = multer({ dest: "uploads/" });

router.get("/events/ingestion-status/:jobId", async (req, res) => {
  const job = jobStore[req.params.jobId];
  if (!job) {
    return res.status(404).json({ error: "Job ID not found" });
  }

  const {
    status,
    processedLines = 0,
    errorLines = 0,
    totalLines = 0,
    errors = [],
    startTime,
    endTime,
  } = job;

  const response = {
    jobId: req.params.jobId,
    status,
    processedLines,
    errorLines,
    totalLines,
    errors,
  };

  if (status === "COMPLETED") {
    response.startTime = startTime;
    response.endTime = endTime;
  }

  res.status(200).json(response);
});

router.post("/events/ingest", upload.single("file"), async (req, res) => {
  const jobId = `ingest-job-${uuidv4()}`;
  let filePath;

  if (req.headers["content-type"].includes("multipart/form-data") && req.file) {
    filePath = req.file.path;
  } else if (req.headers["content-type"].includes("application/json") && req.body.filePath) {
    filePath = req.body.filePath;
  } else {
    return res.status(400).json({ error: "Missing file upload or filePath" });
  }

  jobStore[jobId] = { status: "pending", startedAt: new Date(), errors: [] };

  ingestFile(filePath, jobId).catch((err) => {
    jobStore[jobId].status = "failed";
    jobStore[jobId].errors.push(err.message);
  });

  res.status(202).json({
    status: "Ingestion initiated",
    jobId,
    message: `Check /api/events/ingestion-status/${jobId} for updates.`,
  });
});

module.exports = router;
