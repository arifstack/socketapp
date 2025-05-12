import React, { useState, useEffect } from 'react';
import '../styles/ChatPage.css';
import { IoChatbubbleOutline } from 'react-icons/io5';

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
    <div className="container">
      <div class="chatlist">
        <div class="header">
          <div class="userimg">
            <img src="images/user.jpg" alt="" class="cover"></img>
          </div>
          <ul class="nav_icons">
            <li><ion-icon name="scan-circle-outline"></ion-icon></li>
            <li><ion-icon name="chatbox"></ion-icon></li>
            <li><ion-icon name="ellipsis-vertical"></ion-icon></li>
          </ul>
        </div>
        <div class="search_chat">
          <div>
            <input type="text" placeholder="Search or start new chat"></input>
            <ion-icon name="search-outline"></ion-icon>
          </div>
        </div>
        <div class="block active">
          <div class="imgBox">
            <img src="images/img1.jpg" class="cover" alt=""></img>
          </div>
          <div class="details">
            <div class="listHead">
              <h4>Jhon Doe</h4>
              <p class="time">10:56</p>
            </div>
            <div class="message_p">
              <p>How are you doing?</p>
            </div>
          </div>
        </div>
        <div class="block unread">
          <div class="imgBox">
            <img src="images/img2.jpg" class="cover" alt=""></img>
          </div>
          <div class="details">
            <div class="listHead">
              <h4>Andre</h4>
              <p class="time">12:34</p>
            </div>
            <div class="message_p">
              <p>I love your youtube videos!</p>
              <b>1</b>
            </div>
          </div>
        </div>

        <div class="block unread">
          <div class="imgBox">
            <img src="images/img3.jpg" class="cover" alt=""></img>
          </div>
          <div class="details">
            <div class="listHead">
              <h4>Olivia</h4>
              <p class="time">Yesterday</p>
            </div>
            <div class="message_p">
              <p>I just subscribed to your channel</p>
              <b>2</b>
            </div>
          </div>
        </div>
      </div>
      <div class="rightSide">
        <div class="header">
          <div class="imgText">
            <div class="userimg">
              <img src="images/img1.jpg" alt="" class="cover"></img>
            </div>
            <h4>Qazi</h4>
          </div>
          <ul class="nav_icons">
            <li><ion-icon name="search-outline"></ion-icon></li>
            <li><ion-icon name="ellipsis-vertical"></ion-icon></li>
          </ul>
        </div>
        <div class="chatbox">
          <div class="message my_msg">
            <p>Akibat serangan tersebut, Handa mengalami luka bacok di sekujur tubuhnya dan segera dilarikan ke Rumah Sakit Umum Daerah (RSUD) BARI Palembang untuk mendapatkan perawatan.

Artikel ini telah tayang di Kompas.com dengan judul "Pengantin Dibacok Jelang Akad Nikah di Palembang, Pelaku Ternyata Musuh Lama, Diduga Dendam", Klik untuk baca: https://regional.kompas.com/read/2025/05/12/121353678/pengantin-dibacok-jelang-akad-nikah-di-palembang-pelaku-ternyata-musuh-lama?source=terpopuler.


Kompascom+ baca berita tanpa iklan: https://kmp.im/plus6
Download aplikasi: https://kmp.im/app6<span>12:18</span></p>
          </div>
          <div class="message friend_msg">
            <p>Hey <span>12:18</span></p>
          </div>
        </div>

        <div class="chat_input">
            <ion-icon name="happy-outline"></ion-icon>
            <input type="text" placeholder="Type a message"></input>
            <ion-icon name="mic"></ion-icon>
          </div>
      </div>
    </div>
  );
}

export default ChatPage;
