import React from 'react';
import '../styles/ChatList.css'; // Import CSS khusus komponen ini



const ChatList = ({ profileUrl, name, message, time }) => {
  return (
    <div className="chat-item">
      <img src={profileUrl} alt={name} className="chat-avatar" />
      <div className="chat-info">
        <div className="chat-header">
          <span className="chat-name">{name}</span>
          <span className="chat-time">{time}</span>
        </div>
        <div className="chat-message">
          <span className="chat-check">✔</span>
          <span className="chat-text">{message}</span>
        </div>
      </div>
      <div className="chat-pin">📌</div>
    </div>
  );
};

export default ChatList;
