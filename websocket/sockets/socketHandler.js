module.exports = (socket, io) => {
  // Simpan data room untuk user ini
  let currentRoom = null;

  // Join ke room
  socket.on('joinRoom', ({ roomId }) => {
    if (currentRoom) {
      socket.leave(currentRoom); // Keluar dari room sebelumnya
    }

    socket.join(roomId);
    currentRoom = roomId;

    console.log(`${socket.user.username} bergabung ke room ${roomId}`);

    // Beritahu user lain di room
    socket.to(roomId).emit('receiveMessage', {
      sender: 'System',
      message: `${socket.user.username} telah bergabung ke room.`,
      timestamp: new Date(),
    });
  });

  // Kirim pesan ke room
  socket.on('sendMessage', ({ roomId, message }) => {
    if (!roomId || !message) return;

    const payload = {
      sender: socket.user.username,
      message,
      timestamp: new Date(),
    };

    io.to(roomId).emit('receiveMessage', payload);
    console.log(`[${roomId}] ${payload.sender}: ${payload.message}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (currentRoom) {
      socket.to(currentRoom).emit('receiveMessage', {
        sender: 'System',
        message: `${socket.user.username} telah keluar dari room.`,
        timestamp: new Date(),
      });
    }

    console.log(`🔌 ${socket.user.username} disconnect`);
  });
};
