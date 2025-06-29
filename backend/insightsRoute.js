const express = require("express");
const router = express.Router();
const { Client } = require("pg");

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});
db.connect();

function calculateOverlap(startA, endA, startB, endB) {
  const overlapStart = new Date(Math.max(new Date(startA), new Date(startB)));
  const overlapEnd = new Date(Math.min(new Date(endA), new Date(endB)));

  if (overlapStart < overlapEnd) {
    return Math.floor((overlapEnd - overlapStart) / (1000 * 60));
  }
  return 0;
}

router.get("/insights/overlapping-events", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate and endDate are required" });
  }

  try {
    const query = `
      SELECT e1.event_id AS id1, e1.event_name AS name1, e1.start_date AS start1, e1.end_date AS end1,
             e2.event_id AS id2, e2.event_name AS name2, e2.start_date AS start2, e2.end_date AS end2
      FROM historical_events e1
      JOIN historical_events e2
        ON e1.event_id < e2.event_id
        AND e1.start_date < e2.end_date
        AND e1.end_date > e2.start_date
      WHERE e1.start_date <= $2 AND e1.end_date >= $1
        AND e2.start_date <= $2 AND e2.end_date >= $1
    `;

    const { rows } = await db.query(query, [startDate, endDate]);

    const overlaps = [];

    for (const row of rows) {
      const overlapDuration = calculateOverlap(row.start1, row.end1, row.start2, row.end2);
      if (overlapDuration > 0) {
        overlaps.push({
          overlappingEventPairs: [
            {
              event_id: row.id1,
              event_name: row.name1,
              start_date: row.start1,
              end_date: row.end1,
            },
            {
              event_id: row.id2,
              event_name: row.name2,
              start_date: row.start2,
              end_date: row.end2,
            },
          ],
          overlap_duration_minutes: overlapDuration,
        });
      }
    }

    res.status(200).json(overlaps);
  } catch (err) {
    console.error("Error in overlapping-events:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
