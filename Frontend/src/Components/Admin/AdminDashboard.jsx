import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  const [userName, setUserName] = useState("Admin");
  const [people, setPeople] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [name, setName] = useState("");
  const [streetName, setStreetName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState("newest");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [editingPerson, setEditingPerson] = useState(null);
  const [personToDelete, setPersonToDelete] = useState(null);
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Protect dashboard
  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    const name = localStorage.getItem("adminName") || "Admin";
    setToken(t);
    setUserName(name);
    if (!t) navigate("/admin/login", { replace: true });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/admin/login", { replace: true });
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const fetchPeople = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/admin/people`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        handleLogout();
        return;
      }

      const data = await res.json();
      setPeople(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPeople();
  }, [token]);

  const sortData = (list) => {
    let sorted = [...list];
    if (sortMode === "az") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortMode === "za") sorted.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortMode === "newest") sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortMode === "oldest") sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    return sorted;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, streetName, location, date: new Date() };

    try {
      if (editingPerson) {
        await fetch(`${API_URL}/admin/people/${editingPerson._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        setEditingPerson(null);
      } else {
        await fetch(`${API_URL}/admin/people`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }

      setName("");
      setStreetName("");
      setLocation("");
      fetchPeople();
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    if (!personToDelete) return;

    try {
      await fetch(`${API_URL}/admin/people/${personToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPersonToDelete(null);
      fetchPeople();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (person) => {
    setEditingPerson(person);
    setName(person.name);
    setStreetName(person.streetName);
    setLocation(person.location);
  };

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const start = (page - 1) * rowsPerPage;
  const displayed = sortData(filtered).slice(start, start + rowsPerPage);

  useEffect(() => {
    const query = search.toLowerCase();
    setFiltered(
      people.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.streetName.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query)
      )
    );
    setPage(1);
  }, [search, people]);

  if (!token) return <p className="p-4 text-black">Redirecting to login...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-white p-4 shadow mb-6">
        <h1 className="text-xl text-green-600 font-bold">
          Welcome, {userName}!
        </h1>
        <button onClick={handleLogout} className="btn btn-sm bg-red-600 text-white">
          Logout
        </button>
      </div>

      <div className="px-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="font-bold mb-2 text-green-600">
            {editingPerson ? "Edit Person" : "Add New Person"}
          </h2>

          <div className="flex flex-col md:flex-row gap-3">
            <input className="input input-bordered flex-1" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="input input-bordered flex-1" placeholder="Street Name" value={streetName} onChange={(e) => setStreetName(e.target.value)} required />
            <input className="input input-bordered flex-1" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
            <button className="btn bg-green-600 text-white">{editingPerson ? "Update" : "Add"}</button>
          </div>
        </form>

        {/* Search and sort */}
        <div className="flex justify-between mb-3">
          <input
            id="adminSearch"
            type="text"
            placeholder="Search..."
            className="input input-bordered w-48"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="select select-bordered" value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
            <option value="newest">Date: Newest</option>
            <option value="oldest">Date: Oldest</option>
            <option value="az">Name A–Z</option>
            <option value="za">Name Z–A</option>
          </select>
        </div>

        {/* Table */}
        {loading ? <p className="text-black p-4">Loading data...</p> :
          filtered.length === 0 ? <p className="text-black p-4">No records found.</p> :
            <div className="overflow-x-auto bg-white p-4 rounded-xl border border-gray-300 shadow-lg">
              <table className="table table-xs w-full">
                <thead className="bg-gray-200 text-black">
                  <tr><th>#</th><th>Name</th><th>Street Name</th><th>Location</th><th>Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {displayed.map((p, index) => (
                    <tr key={p._id} className="hover:bg-gray-100 text-black">
                      <th>{start + index + 1}</th>
                      <td>{p.name}</td>
                      <td>{p.streetName}</td>
                      <td>{p.location}</td>
                      <td>{formatDate(p.date)}</td>
                      <td>
                        <button className="btn btn-sm bg-grey text-white mr-2" onClick={() => startEdit(p)}>Edit</button>
                        <button className="btn btn-sm bg-red-600 text-white" onClick={() => setPersonToDelete(p)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center gap-3 mt-3">
                <button disabled={page === 1} className="btn btn-sm" onClick={() => setPage(page - 1)}>Prev</button>
                <span className="text-black">Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} className="btn btn-sm" onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </div>
        }
      </div>

      {/* Delete Modal */}
      {personToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-center text-black">
            <p>Delete <b>{personToDelete.name}</b>?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button className="btn bg-red-600 text-white" onClick={confirmDelete}>Delete</button>
              <button className="btn" onClick={() => setPersonToDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

