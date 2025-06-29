const express = require("express");
const router = express.Router();
const { Client } = require("pg");

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
db.connect();

async function buildEventTree(eventId) {
  const eventRes = await db.query(
    `SELECT * FROM historical_events WHERE event_id = $1`,
    [eventId]
  );
  const event = eventRes.rows[0];
  if (!event) return null;

  const childrenRes = await db.query(
    `SELECT * FROM historical_events WHERE parent_event_id = $1 ORDER BY start_date ASC`,
    [eventId]
  );

  const children = [];
  for (const child of childrenRes.rows) {
    const childTree = await buildEventTree(child.event_id);
    if (childTree) children.push(childTree);
  }

  return {
    event_id: event.event_id,
    event_name: event.event_name,
    description: event.description,
    start_date: event.start_date,
    end_date: event.end_date,
    duration_minutes: event.duration_minutes,
    parent_event_id: event.parent_event_id,
    children,
  };
}

router.get("/timeline/:rootEventId", async (req, res) => {
  const { rootEventId } = req.params;

  try {
    const timeline = await buildEventTree(rootEventId);

    if (!timeline) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(timeline);
  } catch (err) {
    console.error("Error fetching timeline:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
