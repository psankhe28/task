const fs = require("fs");
const readline = require("readline");
const { Client } = require("pg");
const validator = require("validator");
const path = require("path");
const jobStore = require("./jobStore");

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
db.connect();

function isValidUUID(uuid) {
  return [1, 2, 3, 4, 5].some(version => validator.isUUID(uuid, version));
}

async function ingestFile(filePath, jobId) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  const job = jobStore[jobId];
  job.status = "PROCESSING";
  job.startTime = new Date();
  job.processedLines = 0;
  job.errorLines = 0;
  job.totalLines = 0;
  job.errors = [];

  const isCsv = path.extname(filePath).toLowerCase() === ".csv";
  const delimiter = isCsv ? "," : "|";

  let lineNumber = 0;

  for await (const line of rl) {
    lineNumber++;
    job.totalLines++;

    if (!line.trim()) continue;

    if (
      line.toLowerCase().startsWith("eventid|eventname|startdate|enddate|parentid|researchvalue|description")
    ) {
      continue;
    }

    const parts = line.split(delimiter).map(p => p.trim());
    if (parts.length !== 7) {
      job.errorLines++;
      job.errors.push(`Line ${lineNumber}: Malformed entry: '${line}'`);
      continue;
    }

    const [event_id, event_name, start, end, parent_id, research_value, description] = parts;

    if (!isValidUUID(event_id)) {
      job.errorLines++;
      job.errors.push(`Line ${lineNumber}: Validation failed - Invalid event_id UUID: '${event_id}'`);
      continue;
    }

    if (!validator.isISO8601(start)) {
      job.errorLines++;
      job.errors.push(`Line ${lineNumber}: Validation failed - Invalid start date: '${start}'`);
      continue;
    }

    if (!validator.isISO8601(end)) {
      job.errorLines++;
      job.errors.push(`Line ${lineNumber}: Validation failed - Invalid end date: '${end}'`);
      continue;
    }

    if (parent_id !== "NULL" && !validator.isUUID(parent_id)) {
      job.errorLines++;
      job.errors.push(`Line ${lineNumber}: Validation failed - Invalid parent_id UUID: '${parent_id}'`);
      continue;
    }

    try {
      await db.query(
        `INSERT INTO historical_events (
          event_id, event_name, start_date, end_date, parent_event_id, research_value, description, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          event_id,
          event_name,
          new Date(start),
          new Date(end),
          parent_id === "NULL" ? null : parent_id,
          research_value,
          description,
          { source: path.basename(filePath), line: lineNumber },
        ]
      );
      job.processedLines++;
    } catch (err) {
      job.errorLines++;
      job.errors.push(`Line ${lineNumber}: DB error: ${err.message}`);
    }
  }

  job.status = "COMPLETED";
  job.endTime = new Date();
}

module.exports = ingestFile;
