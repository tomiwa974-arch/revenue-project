import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const [userName, setUserName] = useState(localStorage.getItem("adminName") || "Admin");
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

  // New state for delete modal
  const [personToDelete, setPersonToDelete] = useState(null);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/admin/login");
  };

  // Protect dashboard
  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate, token]);

  // Format date
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Fetch people
  const fetchPeople = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/admin/people", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        navigate("/admin/login");
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
    fetchPeople();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sort
  const sortData = (list) => {
    let sorted = [...list];
    if (sortMode === "az") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortMode === "za") sorted.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortMode === "newest") sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortMode === "oldest") sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    return sorted;
  };

  // Search
  useEffect(() => {
    const searchInput = document.getElementById("adminSearch");
    const handleSearch = (e) => {
      const text = e.target.value.toLowerCase();
      const filteredData = people.filter((p) =>
        Object.values(p).some((v) => String(v).toLowerCase().includes(text))
      );
      setFiltered(filteredData);
      setPage(1);
    };
    if (searchInput) searchInput.addEventListener("input", handleSearch);
    return () => searchInput && searchInput.removeEventListener("input", handleSearch);
  }, [people]);

  // Add/Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, streetName, location, date: new Date() };
    if (!token) return;

    try {
      if (editingPerson) {
        await fetch(`http://localhost:5000/admin/people/${editingPerson._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        setEditingPerson(null);
      } else {
        await fetch("http://localhost:5000/admin/people", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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

  // Delete with modal
  const confirmDelete = async () => {
    if (!token || !personToDelete) return;
    try {
      await fetch(`http://localhost:5000/admin/people/${personToDelete._id}`, {
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-white text-black p-4 shadow mb-6">
        <h1 className="text-xl font-bold">Welcome, {userName}!</h1>
        <button onClick={handleLogout} className="btn btn-sm bg-red-600 text-white">Logout</button>
      </div>

      {/* Form */}
      <div className="px-6">
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="font-bold mb-2 text-green-600">{editingPerson ? "Edit Person" : "Add New Person"}</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input type="text" placeholder="Name" className="input input-bordered flex-1" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="text" placeholder="Street Name" className="input input-bordered flex-1" value={streetName} onChange={(e) => setStreetName(e.target.value)} required />
            <input type="text" placeholder="Location" className="input input-bordered flex-1" value={location} onChange={(e) => setLocation(e.target.value)} required />
            <button type="submit" className="btn bg-green-600 text-white">{editingPerson ? "Update" : "Add"}</button>
            {editingPerson && (
              <button type="button" className="btn btn-gray-400 text-white" onClick={() => { setEditingPerson(null); setName(""); setStreetName(""); setLocation(""); }}>Cancel</button>
            )}
          </div>
        </form>

        {/* Search and sort */}
        <div className="flex justify-between mb-3">
          <input id="adminSearch" type="text" placeholder="Search..." className="input input-bordered w-48" />
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

      {/* ✅ DELETE CONFIRMATION MODAL */}
      {personToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl text-black w-full max-w-md text-center">
            <h2 className="font-bold mb-2 text-red-600">Confirm Delete</h2>
            <p>Are you sure you want to delete <b>{personToDelete.name}</b>?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button className="btn btn-sm bg-red-600 text-white" onClick={confirmDelete}>Delete</button>
              <button className="btn btn-sm bg-gray-400 text-black" onClick={() => setPersonToDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;



