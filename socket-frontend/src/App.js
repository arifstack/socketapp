import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatPage from './pages/ChatPage';
import RequireAuth from './components/RequireAuth'; // Import here
import io from 'socket.io-client';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [socket, setSocket] = useState(null);

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const handleRegister = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  useEffect(() => {
    if (token) {
      const socketConnection = io('http://localhost:3000', {
        auth: { token },
      });

      socketConnection.on('connect', () => {
        console.log('Connected to socket server');
      });

      socketConnection.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      setSocket(socketConnection);

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [token]);

  return (
    <Router>
      <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route
            path="/chatpage"
            element={
              <RequireAuth token={token}>
                <ChatPage socket={socket} />
              </RequireAuth>
            }
          />
          <Route
            path="/"
            element={
              <RequireAuth token={token}>
                <ChatPage socket={socket}></ChatPage>
              </RequireAuth>
            }
          />
        </Routes>
    </Router>
  );
}

export default App;
