import { useState } from "react";
import { getTimeline } from "../api/api";

export default function Timelines() {

  const [eventId, setEventId] = useState('');
  const [timeline, setTimeline] = useState(null);

  const fetchTimeline = async () => {
    const res = await getTimeline(eventId);
    setTimeline(res.data);
  };

  return (
    <div className="w-full-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Timeline Viewer</h2>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          value={eventId}
          onChange={e => setEventId(e.target.value)}
          placeholder="Enter Root Event ID"
          className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          onClick={fetchTimeline}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={!eventId}
        >
          Get Timeline
        </button>
      </div>
      {timeline && (
        <pre className="bg-gray-100 rounded p-4 border border-gray-200 text-sm overflow-x-auto">
          {JSON.stringify(timeline, null, 2)}
        </pre>
      )}
    </div>
  );
};