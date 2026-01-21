import React, { useEffect, useState } from "react";

function Hero() {
  const [people, setPeople] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState("newest");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [search, setSearch] = useState("");

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const fetchPeople = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/people`);
      const data = await res.json();
      setPeople(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  // 🔍 SEARCH ALL FIELDS
  useEffect(() => {
    const term = search.toLowerCase().trim();

    const result = people.filter((person) =>
      [
        person.name,
        person.streetName,
        person.location,
        person.date,
      ]
        .filter(Boolean)
        .some((field) =>
          field.toString().toLowerCase().includes(term)
        )
    );

    setFiltered(result);
    setPage(1);
  }, [search, people]);

  const sortData = (list) => {
    let sorted = [...list];
    if (sortMode === "az") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortMode === "za")
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortMode === "newest")
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortMode === "oldest")
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    return sorted;
  };

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const start = (page - 1) * rowsPerPage;
  const displayed = sortData(filtered).slice(start, start + rowsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-100 text-black border border-green-400 shadow-xl rounded-xl p-4 sm:p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold">Welcome</h1>
              <p className="text-sm sm:text-base opacity-70">
                Here is your people list
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center mb-4">
              <input
                type="text"
                placeholder="Search name, street, location, date..."
                className="input input-bordered bg-white text-black w-full sm:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="select select-bordered bg-white text-black w-full sm:w-48"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="az">Name A–Z</option>
                <option value="za">Name Z–A</option>
              </select>

              <button
                onClick={fetchPeople}
                className="btn btn-sm bg-green-600 text-white w-full sm:w-auto"
              >
                Refresh
              </button>
            </div>

            {loading && <p className="py-6 text-center">Loading data...</p>}

            {!loading && filtered.length === 0 && (
              <p className="py-6 text-center">No records found.</p>
            )}

            {!loading && filtered.length > 0 && (
              <div className="overflow-x-auto">
                <table className="table table-xs min-w-[700px]">
                  <thead className="text-black">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Street Name</th>
                      <th>Location</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.map((person, index) => (
                      <tr
                        key={person._id}
                        className="hover:bg-gray-200 cursor-pointer"
                        onClick={() => setSelectedPerson(person)}
                      >
                        <th>{start + index + 1}</th>
                        <td>{person.name}</td>
                        <td>{person.streetName}</td>
                        <td>{person.location}</td>
                        <td>{formatDate(person.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
              <button
                disabled={page === 1}
                className="btn btn-sm w-full sm:w-auto"
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>

              <span className="text-sm">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                className="btn btn-sm w-full sm:w-auto"
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-200 text-black p-4 flex justify-center items-center border border-green-400">
        <p>©️ {new Date().getFullYear()} — All rights reserved</p>
      </footer>

      {selectedPerson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 text-black">
            <h2 className="font-bold mb-3">Details</h2>
            <p><b>Name:</b> {selectedPerson.name}</p>
            <p><b>Street:</b> {selectedPerson.streetName}</p>
            <p><b>Location:</b> {selectedPerson.location}</p>
            <p><b>Date:</b> {formatDate(selectedPerson.date)}</p>

            <button
              className="btn btn-sm bg-green-600 text-white mt-4 w-full"
              onClick={() => setSelectedPerson(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hero;
