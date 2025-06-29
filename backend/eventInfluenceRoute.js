const express = require("express");
const router = express.Router();
const { Client } = require("pg");

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
db.connect();

function durationInMinutes(start, end) {
  return Math.floor((new Date(end) - new Date(start)) / 60000);
}

router.get("/insights/event-influence", async (req, res) => {
  const { sourceEventId, targetEventId } = req.query;

  if (!sourceEventId || !targetEventId) {
    return res.status(400).json({ error: "Both sourceEventId and targetEventId are required." });
  }

  try {
    const { rows: events } = await db.query(`
      SELECT event_id, event_name, start_date, end_date, parent_event_id
      FROM historical_events
    `);

    const eventMap = new Map();
    const graph = new Map();

    for (const event of events) {
      eventMap.set(event.event_id, event);
      if (event.parent_event_id) {
        if (!graph.has(event.parent_event_id)) graph.set(event.parent_event_id, []);
        graph.get(event.parent_event_id).push(event.event_id);
      }
    }

    if (!eventMap.has(sourceEventId) || !eventMap.has(targetEventId)) {
      return res.status(404).json({
        sourceEventId,
        targetEventId,
        shortestPath: [],
        totalDurationMinutes: 0,
        message: "One or both event IDs not found.",
      });
    }

    const visited = new Set();
    const queue = [{
      eventId: sourceEventId,
      path: [],
      totalDuration: 0
    }];

    while (queue.length > 0) {
      queue.sort((a, b) => a.totalDuration - b.totalDuration);
      const { eventId, path, totalDuration } = queue.shift();
      if (visited.has(eventId)) continue;
      visited.add(eventId);

      const currentEvent = eventMap.get(eventId);
      const eventDuration = durationInMinutes(currentEvent.start_date, currentEvent.end_date);

      const newPath = [...path, {
        event_id: eventId,
        event_name: currentEvent.event_name,
        duration_minutes: eventDuration
      }];
      const newTotal = totalDuration + eventDuration;

      if (eventId === targetEventId) {
        return res.status(200).json({
          sourceEventId,
          targetEventId,
          shortestPath: newPath,
          totalDurationMinutes: newTotal,
          message: "Shortest temporal path found from source to target event."
        });
      }

      const children = graph.get(eventId) || [];
      for (const childId of children) {
        if (!visited.has(childId)) {
          queue.push({ eventId: childId, path: newPath, totalDuration: newTotal });
        }
      }
    }

    return res.status(200).json({
      sourceEventId,
      targetEventId,
      shortestPath: [],
      totalDurationMinutes: 0,
      message: "No temporal path found from source to target event."
    });
  } catch (err) {
    console.error("Event influence error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;