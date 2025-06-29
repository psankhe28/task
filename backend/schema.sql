-- Create the main table for historical events
CREATE TABLE IF NOT EXISTS historical_events (
    event_id UUID PRIMARY KEY,
    event_name TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    parent_event_id UUID REFERENCES historical_events(event_id) ON DELETE SET NULL,
    description TEXT,
    research_value TEXT,
    metadata JSONB
);

-- Index to speed up searches on date range
CREATE INDEX IF NOT EXISTS idx_historical_events_start_date ON historical_events(start_date);
CREATE INDEX IF NOT EXISTS idx_historical_events_end_date ON historical_events(end_date);

-- Index to improve searching/filtering by event name
CREATE INDEX IF NOT EXISTS idx_historical_events_event_name ON historical_events(event_name);

-- Index to assist hierarchical traversal
CREATE INDEX IF NOT EXISTS idx_historical_events_parent_event_id ON historical_events(parent_event_id);
