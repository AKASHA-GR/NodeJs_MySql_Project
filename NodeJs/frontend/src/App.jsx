import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =========================
  // GET USERS
  // =========================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      setUsers(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value)
    );
  });

  // =========================
  // OPEN ADD MODAL
  // =========================

  const openAddModal = () => {
    setName("");
    setEmail("");
    setEditingId(null);
    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditingId(user.id);
    setShowModal(true);
  };

  // =========================
  // SAVE USER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setMessage("Name and email are required.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, {
          name,
          email,
        });

        setMessage("User updated successfully.");
      } else {
        await axios.post(API_URL, {
          name,
          email,
        });

        setMessage("User added successfully.");
      }

      setShowModal(false);

      setName("");
      setEmail("");
      setEditingId(null);

      fetchUsers();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.error || "Something went wrong."
      );
    }
  };

  // =========================
  // DELETE
  // =========================

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteId}`);

      setMessage("User deleted successfully.");

      setShowDeleteModal(false);
      setDeleteId(null);

      fetchUsers();
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete user.");
    }
  };

  // =========================
  // NAVIGATION
  // =========================

  const handleNavigation = (page) => {
    setActivePage(page);
  };

  // =========================
  // DASHBOARD
  // =========================

  const Dashboard = () => {
    return (
      <div className="space-y-8">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              Overview
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Good to see you, Admin 👋
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your users and keep your directory organized.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
          >
            + Add User
          </button>
        </div>

        {/* STATISTICS */}

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Users
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {users.length}
            </h2>

            <p className="mt-2 text-xs font-medium text-emerald-600">
              ● Live
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Directory Status
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Active
            </h2>

            <p className="mt-2 text-xs font-medium text-emerald-600">
              ● System operational
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Search Results
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {filteredUsers.length}
            </h2>

            <p className="mt-2 text-xs text-slate-500">
              Matching users
            </p>
          </div>

        </div>

        {/* RECENT USERS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Users
              </h2>

              <p className="text-sm text-slate-500">
                Latest registered users
              </p>
            </div>

            <button
              onClick={() => setActivePage("users")}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View All
            </button>

          </div>

          <div className="mt-6 divide-y">

            {users.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-4"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {user.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {user.email}
                    </p>
                  </div>

                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  Active
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>
    );
  };

  // =========================
  // USERS PAGE
  // =========================

  const Users = () => {
    return (
      <div className="space-y-6">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <p className="text-sm font-semibold text-indigo-600">
              MANAGEMENT
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              Users
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View, edit and manage all users.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
          >
            + Add User
          </button>

        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* SEARCH */}

          <div className="border-b border-slate-200 p-5">

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 md:w-96"
            />

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    ID
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {loading ? (

                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Loading users...
                    </td>
                  </tr>

                ) : filteredUsers.length === 0 ? (

                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      No users found.
                    </td>
                  </tr>

                ) : (

                  filteredUsers.map((user) => (

                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50"
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                            {user.name.charAt(0).toUpperCase()}
                          </div>

                          <div>

                            <p className="font-semibold text-slate-900">
                              {user.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              Registered user
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {user.email}
                      </td>

                      <td className="px-6 py-5">

                        <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          #{user.id}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() => openEditModal(user)}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => confirmDelete(user.id)}
                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    );
  };

  // =========================
  // SETTINGS PAGE
  // =========================

  const Settings = () => {
    return (
      <div className="space-y-6">

        <div>
          <p className="text-sm font-semibold text-indigo-600">
            CONFIGURATION
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your application settings.
          </p>
        </div>

        <div className="max-w-3xl space-y-6">

          {/* PROFILE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              Administrator Profile
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your administrator information.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Name
                </label>

                <input
                  value="Admin User"
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Role
                </label>

                <input
                  value="Administrator"
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                />
              </div>

            </div>

          </div>

          {/* APPLICATION */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              Application
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current application information.
            </p>

            <div className="mt-6 space-y-4">

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                <div>
                  <p className="font-medium text-slate-900">
                    Backend API
                  </p>

                  <p className="text-sm text-slate-500">
                    {API_URL}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Connected
                </span>

              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                <div>
                  <p className="font-medium text-slate-900">
                    Database
                  </p>

                  <p className="text-sm text-slate-500">
                    MySQL
                  </p>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Active
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  };

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="hidden w-64 flex-col bg-[#050817] text-white md:flex">

          {/* LOGO */}

          <div className="flex items-center gap-3 px-6 py-7">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold">
              U
            </div>

            <div>
              <h2 className="font-bold">
                UserHub
              </h2>

              <p className="text-xs text-slate-400">
                Admin Console
              </p>
            </div>

          </div>

          {/* NAVIGATION */}

          <nav className="flex-1 space-y-2 px-4">

            <button
              onClick={() => handleNavigation("dashboard")}
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                activePage === "dashboard"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => handleNavigation("users")}
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                activePage === "users"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              Users
            </button>

          </nav>

          {/* SETTINGS */}

          <div className="px-4 pb-4">

            <button
              onClick={() => handleNavigation("settings")}
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                activePage === "settings"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              Settings
            </button>

          </div>

          {/* ADMIN */}

          <div className="border-t border-slate-800 p-4">

            <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                AD
              </div>

              <div>

                <p className="text-sm font-semibold">
                  Admin User
                </p>

                <p className="text-xs text-slate-400">
                  Administrator
                </p>

              </div>

            </div>

          </div>

        </aside>

        {/* MAIN */}

        <main className="flex-1">

          {/* TOP BAR */}

          <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Management
              </p>

              <h2 className="text-xl font-bold text-slate-900">
                {activePage === "dashboard" && "Dashboard"}
                {activePage === "users" && "User Directory"}
                {activePage === "settings" && "Settings"}
              </h2>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200">
              🔔
            </div>

          </header>

          {/* CONTENT */}

          <div className="mx-auto max-w-7xl p-6 md:p-10">

            {message && (
              <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
                {message}
              </div>
            )}

            {activePage === "dashboard" && <Dashboard />}

            {activePage === "users" && <Users />}

            {activePage === "settings" && <Settings />}

          </div>

        </main>

      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingId ? "Edit User" : "Add User"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingId
                    ? "Update user information."
                    : "Create a new user."}
                </p>

              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

              </div>

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                >
                  {editingId ? "Update User" : "Create User"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =========================
          DELETE MODAL
      ========================= */}

      {showDeleteModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
                🗑️
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Delete User?
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                This action cannot be undone. Are you sure you want to
                delete this user?
              </p>

            </div>

            <div className="mt-6 flex justify-center gap-3">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
              >
                Delete User
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;