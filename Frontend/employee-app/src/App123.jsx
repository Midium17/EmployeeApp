import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  // 1. GET data when page loads - like SELECT
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/employees").then(res => {
      setEmployees(res.data);
    });
  }, []);

  // 2. POST data - like INSERT
  const addEmployee = () => {
    const newEmp = { id: Date.now(), name, role, active: true };
    axios.post("http://127.0.0.1:8000/employees", newEmp).then(res => {
      setEmployees([...employees, res.data]);
      setName(""); setRole("");
    });
  };

  const deleteEmp = (id) => {
    axios.delete("http://127.0.0.1:8000/employees/${id}").then(() => {
      setEmployees(employees.filter(e => e.id!== id));
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Employee Manager - React + FastAPI</h1>

      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Role" value={role} onChange={e => setRole(e.target.value)} />
      <button onClick={addEmployee}>Add</button>

      <h2>Total: {employees.length}</h2>
      {employees.map(emp => (
        <div key={emp.id} style={{ border: "1px solid #ccc", margin: 5, padding: 5 }}>
          {emp.name} - {emp.role}
          <button onClick={() => deleteEmp(emp.id)}> Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;