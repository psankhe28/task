import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

// 1. Ingest Events
export const ingestEvents = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${API_BASE}/events/ingest`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 2. Ingestion Status
export const getIngestionStatus = async (jobId) => {
  return axios.get(`${API_BASE}/events/ingestion-status/${jobId}`);
};

// 3. Timeline by Root Event
export const getTimeline = async (rootEventId) => {
  return axios.get(`${API_BASE}/timeline/${rootEventId}`);
};

// 4. Search Events
export const searchEvents = async (params) => {
  return axios.get(`${API_BASE}/events/search`, { params });
};

// 5. Overlapping Events Insight
export const getOverlappingEvents = async (startDate, endDate) => {
  return axios.get(`${API_BASE}/insights/overlapping-events`, {
    params: { startDate, endDate },
  });
};

// 6. Temporal Gaps Insight
export const getTemporalGaps = async (startDate, endDate) => {
  return axios.get(`${API_BASE}/insights/temporal-gaps`, {
    params: { startDate, endDate },
  });
};

// 7. Event Influence Path
export const getEventInfluence = async (sourceEventId, targetEventId) => {
  return axios.get(`${API_BASE}/insights/event-influence`, {
    params: { sourceEventId, targetEventId },
  });
};
