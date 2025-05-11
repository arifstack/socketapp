import React, { useEffect, useState } from 'react';

function ChatPage({ socket }) {
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Terima pesan dari server
  useEffect(() => {
    if (!socket) return;

    const receiveHandler = (payload) => {
      setMessages((prev) => [...prev, payload]);
    };

    socket.on('receiveMessage', receiveHandler);

    return () => {
      socket.off('receiveMessage', receiveHandler);
    };
  }, [socket]);

  const handleJoinRoom = () => {
    if (!roomId) return alert('Masukkan Room ID');
    socket.emit('joinRoom', { roomId });
    setMessages([]); // Kosongkan pesan saat pindah room
  };

  const handleSend = () => {
    if (!message || !roomId) return alert('Isi pesan dan Room ID!');
    socket.emit('sendMessage', { roomId, message });
    setMessage('');
  };

  return (
    <div>
      <h2>Chat Page</h2>
      <div>
        <input
          type="text"
          placeholder="Masukkan Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Gabung Room</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Ketik pesan"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSend}>Kirim</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Pesan:</h3>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>
              <strong>{msg.sender}:</strong> {msg.message} <em>({new Date(msg.timestamp).toLocaleTimeString()})</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChatPage;
