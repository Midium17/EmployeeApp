import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('username', username);
      form.append('password', password);
      
      const res = await API.post('/login', form);
      localStorage.setItem('token', res.data.access_token);
      setToken(res.data.access_token);
      navigate('/');
    } catch (err) {
      alert('Login failed. Check your credentials.');
    }
  };

  const handleRegister = async () => {
    try {
      await API.post('/register', { username, password });
      alert('Registered successfully! Now log in.');
    } catch (err) {
      alert('Registration failed. Username might already exist.');
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 300, margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2>Login / Register</h2>
      <form onSubmit={handleLogin}>
        <input 
          placeholder="Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          style={{ width: '100%', marginBottom: 10, padding: 8 }} 
          required
        />
        <input 
          placeholder="Password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          style={{ width: '100%', marginBottom: 10, padding: 8 }} 
          required
        />
        <button type="submit" style={{ width: '100%', padding: 8, marginBottom: 5 }}>Login</button>
      </form>
      <button onClick={handleRegister} style={{ width: '100%', padding: 8, background: '#eee' }}>Register</button>
    </div>
  );
}