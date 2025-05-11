import React, { useState, useEffect } from 'react';
import '../styles/ChatPage.css';
import ChatList from '../components/ChatList';
import { FaCheckDouble } from 'react-icons/fa';

function ChatPage({ socket }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [currentRoom, setCurrentRoom] = useState('global');

  const chatData = [
    {
      id: 1,
      profileUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
      name: 'Give me a chance (You)',
      message: 'https://play.google.com/store/apps/details?id=example',
      time: 'Yesterday',
      roomId: 1,
    },
    {
      id: 2,
      profileUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'John Doe',
      message: 'Hey, are you coming to the meeting?',
      time: '2 hours ago',
      roomId: 1,
    },
    {
      id: 3,
      profileUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      name: 'Jane Smith',
      message: 'Got it, thanks!',
      time: 'Just now',
      roomId: 1,
    },
    // ...more mock data
  ];

  useEffect(() => {
    if (!socket) return;
    socket.emit('joinRoom', { roomId: currentRoom });

    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket, currentRoom]);

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit('sendMessage', { roomId: currentRoom, message });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      
      {/* Optional: Sidebar menu */}
      <div className="chat-menu" />

      {/* Sidebar chat list */}
      <div className="chat-sidebar">
        <h3>Chat Rooms</h3>
        <ul>
          {chatData.map(chat => (
            <ChatList
              profileUrl={chat.profileUrl}
              name={chat.name}
              message={chat.message}
              time={chat.time}
            />
          ))}
        </ul>
      </div>

      {/* Main chat area */}
      <div className="chat-main">
        
        {/* Header */}
        <div className="chat-main-header">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
            className="chat-main-avatar"
            alt="Avatar"
          />
          <span className="chat-main-name">Muh Arifandi</span>
          <FaCheckDouble style={{ marginLeft: 'auto', color: 'lightgray' }} />
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className="message">
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Tulis pesan..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Kirim</button>
        </div>

      </div>
    </div>
  );
}

export default ChatPage;
