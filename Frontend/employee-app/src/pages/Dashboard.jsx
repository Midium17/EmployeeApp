import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeList from '../components/EmployeeList';

export default function Dashboard({ onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [myRole] = useState(localStorage.getItem("role") || "user");
  const isAdmin = myRole === "admin";

  // Create User states (admin only)
  const [newUser, setNewUser] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");
  const [showCreateUser, setShowCreateUser] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await API.get('/employees');
      setEmployees(res.data);
    } catch (err) { if (err.response?.status === 401) onLogout(); }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSave = async () => {
    if (!isAdmin) return;
    if (!name ||!role) return alert("Fill all fields");
    try {
      if (editingId) {
        await API.put(`/employees/${editingId}`, { name, role, active: true });
        setEditingId(null);
      } else {
        await API.post('/employees', { name, role, active: true });
      }
      setName(""); setRole(""); fetchEmployees();
    } catch (err) { alert(err.response?.data?.detail || "Failed"); }
  };

  const handleEdit = (emp) => {
    if (!isAdmin) return;
    setEditingId(emp.id); setName(emp.name); setRole(emp.role);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete?")) return;
    await API.delete(`/employees/${id}`);
    fetchEmployees();
  };

  const handleCreateUser = async () => {
    if (!newUser ||!newPass) return alert("Enter username/password");
    try {
      const res = await API.post('/create-user', { username: newUser, password: newPass, role: newUserRole });
      alert(res.data.msg);
      setNewUser(""); setNewPass(""); setShowCreateUser(false);
    } catch (err) { alert(err.response?.data?.detail || "Failed to create user"); }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 600, margin: "auto" }}>
      <Navbar onLogout={onLogout} />
      <div style={{ marginBottom: 10, fontSize: 13, color: isAdmin? "green" : "gray" }}>
        Logged in as: <b>{localStorage.getItem("username")} ({myRole.toUpperCase()})</b>
      </div>

      {isAdmin && (
        <div style={{ border: "1px solid #007bff", padding: 12, marginBottom: 15, borderRadius: 6, background: "#f0f8ff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <b>👑 Admin: Create Users</b>
            <button onClick={() => setShowCreateUser(!showCreateUser)} style={{ padding: "4px 8px" }}>{showCreateUser? "Hide" : "Create User"}</button>
          </div>
          {showCreateUser && (
            <div style={{ marginTop: 10 }}>
              <input placeholder="New username" value={newUser} onChange={e => setNewUser(e.target.value)} style={{ width: "100%", padding: 6, marginBottom: 6 }} />
              <input placeholder="Password" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} style={{ width: "100%", padding: 6, marginBottom: 6 }} />
              <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} style={{ width: "100%", padding: 6, marginBottom: 6 }}>
                <option value="user">User - Read Only</option>
                <option value="admin">Admin</option>
              </select>
              <button onClick={handleCreateUser} style={{ width: "100%", padding: 8, background: "#007bff", color: "white", border: "none" }}>Create User</button>
            </div>
          )}
        </div>
      )}

      {isAdmin? (
        <EmployeeForm name={name} setName={setName} role={role} setRole={setRole} editingId={editingId} handleSave={handleSave} />
      ) : (
        <div style={{ background: "#f0f0f0", padding: 10, marginBottom: 15, textAlign: "center", borderRadius: 5 }}>Read-only mode - Only admin can add employees</div>
      )}

      <EmployeeList employees={employees} search={search} setSearch={setSearch} handleEdit={handleEdit} handleDelete={handleDelete} isAdmin={isAdmin} />
    </div>
  );
}