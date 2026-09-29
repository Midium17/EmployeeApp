export default function Navbar({ onLogout }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <h1>Employee Manager</h1>
      <button onClick={onLogout} style={{ padding: '6px 12px', background: '#ff4d4d', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
}