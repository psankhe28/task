import { useState } from "react";
import { getTemporalGaps } from "../api/api";

export default function TemporalGap() {
  const [gap, setGap] = useState(null);
  const [start, setStart] = useState("2023-01-01T00:00:00Z");
  const [end, setEnd] = useState("2023-01-20T00:00:00Z");

  const loadGap = async () => {
    const res = await getTemporalGaps(start, end);
    setGap(res.data.largestGap);
  };

  return (
    <div className="w-full-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Find Temporal Gap</h2>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          onClick={loadGap}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          Find
        </button>
      </div>
      {gap ? (
        <pre className="bg-gray-100 rounded p-4 border border-gray-200 text-sm overflow-x-auto">{JSON.stringify(gap, null, 2)}</pre>
      ) : (
        <p className="text-gray-500">No gap data found or not loaded.</p>
      )}
    </div>
  );
}
