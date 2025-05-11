require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const socketHandler = require('./sockets/socketHandler');

const app = express();
const server = http.createServer(app);

// ✅ CORS: izinkan semua origin (development only!)
app.use(cors());

app.use(express.json());

const users = {};

// ⏱️ Rate Limiting untuk HTTP endpoint
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Terlalu banyak permintaan, coba lagi nanti.",
});
app.use('/api/', limiter);

// 🟩 Register Endpoint
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password diperlukan' });
  }

  const userId = `user_${Date.now()}`;
  users[userId] = { userId, username, password };

  const token = jwt.sign({ userId, username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token, userId, username });
});

// 🟦 Login Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password diperlukan' });
  }

  const user = Object.values(users).find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: 'User tidak ditemukan' });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: 'Password salah' });
  }

  const token = jwt.sign({ userId: user.userId, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token, userId: user.userId, username: user.username });
});

// 🛡️ Middleware verifikasi token untuk REST API
app.use('/api/protected', (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token diperlukan" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token tidak valid' });
    req.user = decoded;
    next();
  });
});

// 📄 Tes endpoint
app.get('/', (req, res) => {
  res.send('✅ Server aktif dan aman.');
});

app.get('/api/protected', (req, res) => {
  res.json({ message: 'Halo user terautentikasi!', user: req.user });
});

// 🔌 Socket.IO Setup: izinkan semua origin
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// 🛡️ Middleware autentikasi token untuk Socket.IO
io.use((socket, next) => {
  const rawToken = socket.handshake.auth.token;
  const token = rawToken?.startsWith('Bearer ') ? rawToken.split(' ')[1] : rawToken;

  if (!token) return next(new Error('Token diperlukan di socket'));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Token tidak valid'));
    socket.user = decoded;
    next();
  });
});

// 🧠 Handle koneksi socket
io.on('connection', (socket) => {
  console.log(`✅ Socket terhubung: ${socket.id}, user: ${socket.user.username}`);
  socketHandler(socket, io);
});

// 🚀 Jalankan server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
