import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getIngestionStatus } from "../api/api";

export default function IngestionStatus() {
  const location = useLocation();
  const [jobId, setJobId] = useState(location.state?.jobId || "");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    if (!jobId) return;
    setLoading(true);
    setError("");
    setStatus(null);
    try {
      const res = await getIngestionStatus(jobId);
      setStatus(res.data);
    } catch (err) {
      setError("Failed to fetch status. Please check the Job ID.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (jobId) fetchStatus();
    // eslint-disable-next-line
  }, [jobId]);

  return (
    <div className="w-full-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Ingestion Status</h2>
      <div className="flex items-center space-x-2 mb-4">
        <input
          value={jobId}
          onChange={e => setJobId(e.target.value)}
          placeholder="Enter Job ID"
          className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          onClick={fetchStatus}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={!jobId || loading}
        >
          {loading ? "Checking..." : "Check Status"}
        </button>
      </div>
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-700 rounded border border-red-200">
          {error}
        </div>
      )}
      {status && (
        <div className="bg-gray-50 rounded p-4 border border-gray-200">
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Job ID:</span>{" "}
            <span className="font-mono text-blue-700">{status.jobId || jobId}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Status:</span>{" "}
            <span className={
              status.status === "completed"
                ? "text-green-700"
                : status.status === "failed"
                ? "text-red-700"
                : "text-yellow-700"
            }>
              {status.status}
            </span>
          </div>
          {status.startedAt && (
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Started At:</span>{" "}
              <span>{new Date(status.startedAt).toLocaleString()}</span>
            </div>
          )}
          {/* Show start_date and end_date if present */}
          {status.start_date && (
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Start Date:</span>{" "}
              <span>{new Date(status.start_date).toLocaleString()}</span>
            </div>
          )}
          {status.end_date && (
            <div className="mb-2">
              <span className="font-semibold text-gray-700">End Date:</span>{" "}
              <span>{new Date(status.end_date).toLocaleString()}</span>
            </div>
          )}
          {status.errors && status.errors.length > 0 && (
            <div className="mt-2">
              <span className="font-semibold text-gray-700">Errors:</span>
              <ul className="list-disc list-inside text-red-700">
                {status.errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};