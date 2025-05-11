import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      return alert('Username dan password diperlukan');
    }

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }), // Mengirimkan username dan password
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token); // Menyimpan token di localStorage
        onLogin(data.token); // Callback untuk mengupdate state login di parent
      } else {
        setErrorMessage(data.error || 'Login gagal');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Terjadi kesalahan, coba lagi nanti.');
    }
  };

  const goToLogin = () => {
    navigate('/register');
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
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button-login onClick={handleLogin}>Login</button-login >
          <button-register onClick={goToLogin}>Belum punya akun? Register</button-register >
        </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default Login;
