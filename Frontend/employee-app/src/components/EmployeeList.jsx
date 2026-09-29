export default function EmployeeList({ employees, search, setSearch, handleEdit, handleDelete }) {
  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input 
        placeholder="Search employees..." 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
        style={{ width: '100%', padding: 8, marginBottom: 15, boxSizing: 'border-box' }} 
      />

      <h2>Total: {employees.length}</h2>

      {filtered.map(emp => (
        <div key={emp.id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderRadius: 4 }}>
          <span><b>{emp.name}</b> — {emp.role}</span>
          <div>
            <button onClick={() => handleEdit(emp)} style={{ marginRight: 6, padding: '4px 8px' }}>Edit</button>
            <button onClick={() => handleDelete(emp.id)} style={{ padding: '4px 8px', background: '#ffcccc', border: 'none', cursor: 'pointer' }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}