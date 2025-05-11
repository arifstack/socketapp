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

 //CORS Setup
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));
const users = {};
app.use(express.json());


// ⏱️ Rate Limiting for HTTP API (not for socket)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // max 100 request per IP per window
  message: "Terlalu banyak permintaan, coba lagi nanti.",
});
app.use('/api/', limiter);

// Register & Token Endpoint
app.post('/api/register', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username diperlukan' });
  }

  // Simpan user (dummy, belum validasi unik)
  const userId = `user_${Date.now()}`;
  users[userId] = { username };

  const token = jwt.sign({ userId, username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token, userId, username });
});


// 🔐 Middleware: Verify Token (for REST endpoint demo)
app.use('/api/protected', (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token :", req.headers.authorization);
  if (!token) return res.status(401).json({ error: "Token diperlukan" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: token });
    req.user = decoded;
    next();
  });
});

app.get('/', (req, res) => {
  res.send('✅ Server aktif dan aman.');
});

app.get('/api/protected', (req, res) => {
  res.json({ message: 'Halo user terautentikasi!', user: req.user });
});

// 🔌 Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

// 🔐 Middleware Autentikasi JWT di Socket.IO
io.use((socket, next) => {
  console.log("Auth data from client:", socket.handshake.auth);
  const rawToken = socket.handshake.auth.token;
  const token = rawToken?.startsWith('Bearer ') ? rawToken.split(' ')[1] : rawToken;

  if (!token) return next(new Error('Token diperlukan di socket'));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Token tidak valid'));
    socket.user = decoded;
    next();
  });
});

// 🎯 Socket Handler
io.on('connection', (socket) => {
  console.log(`✅ Socket terhubung: ${socket.id}, user: ${socket.user.username}`);
  socketHandler(socket, io);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
