import { useState } from "react";
import { searchEvents } from "../api/api";

export default function EventSearch() {
  const [name, setName] = useState("");
  const [sortBy, setSortBy] = useState("start_date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const params = {
      name,
      sortBy,
      sortOrder,
      page,
      limit,
    };
    const res = await searchEvents(params);
    setResults(res.data.events);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Search Events</h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        onSubmit={e => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div>
          <label className="block text-gray-700 mb-1">Event Name</label>
          <input
            type="text"
            placeholder="Event Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="event_name">Name</option>
            <option value="start_date">Start Date</option>
            <option value="end_date">End Date</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Sort Order</label>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Page</label>
          <input
            type="number"
            min={1}
            value={page}
            onChange={e => setPage(Number(e.target.value))}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Page"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Limit</label>
          <input
            type="number"
            min={1}
            value={limit}
            onChange={e => setLimit(Number(e.target.value))}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Limit"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2 text-blue-600 text-center">Results Found</h3>
        <ul className="divide-y divide-gray-200 w-full max-w-md mx-auto">
          {results.length === 0 && !loading && (
            <li className="py-2 text-gray-500 text-center">No events found.</li>
          )}
          {results.map((e, idx) => (
            <li key={e.event_id} className="py-2 flex flex-col items-center">
              <span className="font-semibold text-blue-700">Event {idx + 1}</span>
              <div className="font-mono text-blue-700">Event id: {e.event_id}</div>
              <div className="font-semibold text-gray-800">Event Name: {e.event_name}</div>
              {e.start_date && (
                <span className="ml-2 text-sm text-gray-500">
                  ({new Date(e.start_date).toLocaleDateString()})
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};