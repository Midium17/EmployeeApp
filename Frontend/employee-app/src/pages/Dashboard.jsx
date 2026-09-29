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

  const fetchEmployees = async () => {
    try {
      const res = await API.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
      }
    }
  };

  useEffect(() => { 
    fetchEmployees(); 
  }, []);

  const handleSave = async () => {
    if (!name || !role) return alert("Please fill out all fields.");
    
    try {
      if (editingId) {
        // --- FIX: ACTUAL UPDATE REQUEST ---
        await API.put(`/employees/${editingId}`, { name, role, active: true });
        setEditingId(null);
      } else {
        // --- CREATE REQUEST ---
        await API.post('/employees', { name, role, active: true });
      }
      setName("");
      setRole("");
      fetchEmployees();
    } catch (err) {
      alert("Failed to save employee. Check console.");
      console.error(err);
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setName(emp.name);
    setRole(emp.role);
  };

  const handleDelete = async (id) => {
    await API.delete(`/employees/${id}`);
    fetchEmployees();
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 600, margin: "auto" }}>
      <Navbar onLogout={onLogout} />
      <EmployeeForm 
        name={name} 
        setName={setName} 
        role={role} 
        setRole={setRole} 
        editingId={editingId} 
        handleSave={handleSave} 
      />
      <EmployeeList 
        employees={employees} 
        search={search} 
        setSearch={setSearch} 
        handleEdit={handleEdit} 
        handleDelete={handleDelete} 
      />
    </div>
  );
}