import { useState } from "react";
import { getOverlappingEvents } from "../api/api";

export default function OverlappingEvents() {

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [result, setResult] = useState(null);

  const handleFetch = async () => {
    const res = await getOverlappingEvents(start, end);
    setResult(res.data);
  };

  return (
    <div className="w-full mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Overlapping Events</h2>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="datetime-local"
          value={start}
          onChange={e => setStart(e.target.value)}
          placeholder="Start Date (YYYY-MM-DDTHH:MM:SSZ)"
          className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <input
          type="datetime-local"
          value={end}
          onChange={e => setEnd(e.target.value)}
          placeholder="End Date (YYYY-MM-DDTHH:MM:SSZ)"
          className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          onClick={handleFetch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={!start || !end}
        >
          Get Overlaps
        </button>
      </div>
      {result && (
        <pre className="bg-gray-100 rounded p-4 border border-gray-200 text-sm overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};