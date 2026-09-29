export default function EmployeeForm({ name, setName, role, setRole, editingId, handleSave, setEditingId }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
      <input 
        placeholder="Name" 
        value={name} 
        onChange={e => setName(e.target.value)} 
        style={{ flex: 1, padding: 8 }}
      />
      <input 
        placeholder="Role" 
        value={role} 
        onChange={e => setRole(e.target.value)} 
        style={{ flex: 1, padding: 8 }}
      />
      <button onClick={handleSave} style={{ padding: '8px 16px', background: editingId ? '#ffc107' : '#007bff', color: editingId ? '#000' : '#fff', border: 'none', cursor: 'pointer' }}>
        {editingId ? "Update" : "Add"}
      </button>
      
      {editingId && (
        <button 
          onClick={() => { setEditingId(null); setName(""); setRole(""); }} 
          style={{ padding: '8px 12px', background: '#6c757d', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Cancel
        </button>
      )}
    </div>
  );
}