import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

function App() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchEmployees = () => {
    axios.get(`${API}/employees`).then(res => 
      setEmployees(res.data));
  };

  useEffect(() => { 
    fetchEmployees(); 
  }, []);

  const handleSave = () => {
    if (editingId) {
      // UPDATE
      axios.put(`${API}/employees/${editingId}`, 
        { name, role, active: true }).then(() => {
        fetchEmployees(); 
        setEditingId(null); 
        setName(""); 
        setRole("");
      });
    } else {
      // CREATE
      axios.post(`${API}/employees`, 
        { name, role, active: true }).then(() => {
        fetchEmployees(); 
        setName(""); 
        setRole("");
      });
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setName(emp.name);
    setRole(emp.role);
  };

  const handleDelete = (id) => {
    axios.delete(`${API}/employees/${id}`).then(() => 
      fetchEmployees());
  };

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: 20, 
    fontFamily: "sans-serif", 
    maxWidth: 600, margin: "auto" }}>
      <h1>Employee Manager</h1>
      
      <input 
      placeholder="Search..." 
      value={search} 
      onChange={e => setSearch(e.target.value)} 
      style={{ width: "100%", padding: 8, marginBottom: 10 }} />

      <div style={{ display: "flex", gap: 10, 
        marginBottom: 20 }}>
        <input 
        placeholder="Name" 
        value={name} 
        onChange={e => setName(e.target.value)} />
        <input 
        placeholder="Role" 
        value={role} 
        onChange={e => setRole(e.target.value)} />
        <button onClick={handleSave}>
          {editingId ? "Update" : "Add"}</button>
      </div>

      <h2>Total: {employees.length}</h2>

      {filtered.map(emp => (
        <div key={emp.id} 
        style={{ border: "1px solid #ccc", 
        padding: 10, marginBottom: 5, 
        display: "flex", justifyContent: "space-between" }}>
          <span><b>{emp.name}</b> - {emp.role}</span>
          <div>
            <button onClick={() => 
              handleEdit(emp)}>Edit</button>
            <button onClick={() => 
              handleDelete(emp.id)} style={{ marginLeft: 5 }}>
                Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;