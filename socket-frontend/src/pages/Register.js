import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';
// import '../styles/General.css';
// import '../components/ButtonLogin'

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) return alert('Isi semua kolom!');
    try {
      const res = await axios.post('http://localhost:5000/api/register', {
        username,
        password
      });
      const { token } = res.data;
      onRegister(token);
    } catch (err) {
      alert('Gagal register: ' + (err.response?.data?.error || err.message));
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <img
          src="https://ichat.iconpln.co.id/login-banner-v3.svg"
          alt="Vector"
          className="vector-image"
        />
      </div>
      <div className="register-right">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button-register   onClick={handleRegister}>Daftar</button-register  >
        <button-login onClick={goToLogin}>Sudah punya akun? Login</button-login>
      </div>
    </div>
  );
}

export default Register;
