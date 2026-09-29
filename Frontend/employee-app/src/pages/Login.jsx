import { useState } from 'react';
import API from '../api/axios';

export default function Login({ onLogin, setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      const res = await API.post('/login', formData);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      if (setToken) setToken(res.data.access_token);
      if (onLogin) onLogin();
      return;
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFirstAdmin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post('/create-first-admin', { username, password, role: "admin" });
      alert("First admin created! Now login.");
      setIsFirstAdmin(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>{isFirstAdmin ? "Create First Admin" : "Login"}</h2>
      <form onSubmit={isFirstAdmin ? handleCreateFirstAdmin : handleLogin}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 10 }} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 10 }} required />
        <button disabled={loading} style={{ width: "100%", padding: 10, background: "green", color: "white", border: "none" }}>{loading ? "..." : (isFirstAdmin ? "Create Admin" : "Login")}</button>
      </form>
      {error && <p style={{ color: "red", fontSize: 12 }}>{error}</p>}
      <p style={{ fontSize: 12, textAlign: "center" }}>
        <span onClick={() => setIsFirstAdmin(!isFirstAdmin)} style={{ color: "blue", cursor: "pointer" }}>{isFirstAdmin ? "Back to Login" : "No admin yet? Create First Admin"}</span>
      </p>
    </div>
  );
}