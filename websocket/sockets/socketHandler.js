module.exports = (socket, io) => {
  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
    console.log(`${socket.user.username} bergabung ke room ${roomId}`);
  });

  socket.on('sendMessage', ({ roomId, message }) => {
    const payload = {
      sender: socket.user.username,
      message,
      timestamp: new Date(),
    };

    // Kirim ke semua di room
    io.to(roomId).emit('receiveMessage', payload);
    console.log(`[${roomId}] ${payload.sender}: ${payload.message}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 ${socket.user.username} disconnect`);
  });
};
