-- Create extension for UUID generation (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: historical_events
CREATE TABLE historical_events (
    event_id UUID PRIMARY KEY,
    event_name TEXT NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    parent_id UUID,
    description JSONB DEFAULT '{}',

    CONSTRAINT fk_parent_event
        FOREIGN KEY (parent_id)
        REFERENCES historical_events(event_id)
        ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX idx_historical_events_start_date ON historical_events(start_date);
CREATE INDEX idx_historical_events_end_date ON historical_events(end_date);
CREATE INDEX idx_historical_events_parent_id ON historical_events(parent_id);
