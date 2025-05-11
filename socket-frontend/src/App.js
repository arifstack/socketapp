import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Connect to socket once token is set
  useEffect(() => {
    if (token) {
      const newSocket = io('http://localhost:3000', {
        auth: {
          token: token,
        },
      });

      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id);
      });

      newSocket.on('message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      newSocket.on('disconnect', () => {
        console.log('⚠️ Socket disconnected');
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [token]);

  // Register and get token
  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        console.log('🎫 Token:', data.token);
      } else {
        alert('Registrasi gagal');
      }
    } catch (err) {
      console.error(' Error:', err);
    }
  };

  // Send message via socket
  const handleSend = () => {
    if (socket && message.trim() !== '') {
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🔌 React + Socket.IO + JWT</h1>

      {!token ? (
        <>
          <input
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleRegister}>Daftar</button>
        </>
      ) : (
        <>
          <p>👋 Selamat datang, <strong>{username}</strong></p>
          <div>
            <input
              type="text"
              placeholder="Ketik pesan"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSend}>Kirim</button>
          </div>
          <div>
            <h3>📩 Pesan Masuk</h3>
            <ul>
              {messages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
