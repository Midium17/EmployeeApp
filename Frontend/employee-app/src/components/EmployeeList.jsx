export default function EmployeeList({ employees, search, setSearch, handleEdit, handleDelete, isAdmin }) {
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
          {isAdmin && (
            <div>
              <button onClick={() => handleEdit(emp)} style={{ marginRight: 6, padding: '4px 8px', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => handleDelete(emp.id)} style={{ padding: '4px 8px', background: '#ffcccc', border: '1px solid #cc0000', cursor: 'pointer', borderRadius: 3 }}>Delete</button>
            </div>
          )}
        </div>
      ))}

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888' }}>No employees found.</p>
      )}
    </div>
  );
}