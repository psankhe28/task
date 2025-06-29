const express = require("express");
const router = express.Router();
const { Client } = require("pg");

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
db.connect();

router.get("/events/search", async (req, res) => {
  try {
    const {
      name,
      start_date_after,
      end_date_before,
      sortBy = "start_date",
      sortOrder = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const values = [];
    const whereClauses = [];

    if (name) {
      values.push(`%${name.toLowerCase()}%`);
      whereClauses.push(`LOWER(event_name) LIKE $${values.length}`);
    }
    if (start_date_after) {
      values.push(new Date(start_date_after));
      whereClauses.push(`start_date > $${values.length}`);
    }
    if (end_date_before) {
      values.push(new Date(end_date_before));
      whereClauses.push(`end_date < $${values.length}`);
    }

    const whereSQL = whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";

    const sortField = ["event_name", "start_date", "end_date"].includes(sortBy) ? sortBy : "start_date";
    const order = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

    const countResult = await db.query(`SELECT COUNT(*) FROM historical_events ${whereSQL}`, values);
    const totalEvents = parseInt(countResult.rows[0].count);

    const paginatedQuery = `
      SELECT event_id, event_name
      FROM historical_events
      ${whereSQL}
      ORDER BY ${sortField} ${order}
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;
    values.push(parseInt(limit), offset);

    const eventsResult = await db.query(paginatedQuery, values);

    res.status(200).json({
      totalEvents,
      page: parseInt(page),
      limit: parseInt(limit),
      events: eventsResult.rows,
    });
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
