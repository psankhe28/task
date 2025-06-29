const express = require("express");
const router = express.Router();
const { Client } = require("pg");

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
db.connect();

router.get("/insights/temporal-gaps", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate and endDate are required." });
  }

  try {
    const query = `
      SELECT event_id, event_name, start_date, end_date
      FROM historical_events
      WHERE start_date <= $2 AND end_date >= $1
      ORDER BY start_date ASC
    `;
    const { rows: events } = await db.query(query, [startDate, endDate]);

    if (events.length < 2) {
      return res.status(200).json({
        largestGap: null,
        message: "No significant temporal gaps found within the specified range, or too few events.",
      });
    }

    let largestGap = 0;
    let gapStart = null;
    let gapEnd = null;
    let precedingEvent = null;
    let succeedingEvent = null;

    if (new Date(startDate) < new Date(events[0].start_date)) {
      const gap = (new Date(events[0].start_date) - new Date(startDate)) / (1000 * 60);
      if (gap > largestGap) {
        largestGap = gap;
        gapStart = startDate;
        gapEnd = events[0].start_date;
        precedingEvent = null;
        succeedingEvent = events[0];
      }
    }

    for (let i = 0; i < events.length - 1; i++) {
      const current = events[i];
      const next = events[i + 1];
      const gap = (new Date(next.start_date) - new Date(current.end_date)) / (1000 * 60);

      if (gap > largestGap) {
        largestGap = gap;
        gapStart = current.end_date;
        gapEnd = next.start_date;
        precedingEvent = current;
        succeedingEvent = next;
      }
    }

    const lastEvent = events[events.length - 1];
    if (new Date(lastEvent.end_date) < new Date(endDate)) {
      const gap = (new Date(endDate) - new Date(lastEvent.end_date)) / (1000 * 60);
      if (gap > largestGap) {
        largestGap = gap;
        gapStart = lastEvent.end_date;
        gapEnd = endDate;
        precedingEvent = lastEvent;
        succeedingEvent = null;
      }
    }

    if (largestGap === 0) {
      return res.status(200).json({
        largestGap: null,
        message: "No significant temporal gaps found within the specified range.",
      });
    }

    return res.status(200).json({
      largestGap: {
        startOfGap: gapStart,
        endOfGap: gapEnd,
        durationMinutes: Math.floor(largestGap),
        ...(precedingEvent && { precedingEvent: { event_id: precedingEvent.event_id, event_name: precedingEvent.event_name, end_date: precedingEvent.end_date } }),
        ...(succeedingEvent && { succeedingEvent: { event_id: succeedingEvent.event_id, event_name: succeedingEvent.event_name, start_date: succeedingEvent.start_date } }),
      },
      message: "Largest temporal gap identified.",
    });
  } catch (err) {
    console.error("Temporal gap error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
