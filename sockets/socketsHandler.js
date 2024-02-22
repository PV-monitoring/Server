const { _GetUserPlantList } = require('../api/functions.js');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');


function initializeWebSocket(server) {
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5000', // client's origin
      methods: ['GET', 'POST'],
  },
});

  io.on('connection', (socket) => {
    console.log('A client connected');

    // Example: Send data to the client every second
    const dataUpdateInterval = setInterval(async () => {
      try {
        const result = await _GetUserPlantList();
        socket.emit('dataUpdate', result.data.data.list);
        // console.log(result.data.data)
      } catch (error) {
        console.error('Error updating data:', error.message);
      }
    }, 2000);

    socket.on('disconnect', () => {
      console.log('A client disconnected');
      clearInterval(dataUpdateInterval);
    });
  });

  httpServer.listen(5002, () => {
    console.log('Socket.IO server listening on port 5002');
  });
}

module.exports = { initializeWebSocket };
