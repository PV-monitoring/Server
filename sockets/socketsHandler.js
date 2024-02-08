const { _GetUserPlantList } = require('../api/functions.js');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const GetUserPlantList = process.env.GetUserPlantList;

function initializeWebSocket(server) {
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000', // client's origin
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
    }, 1000);

    socket.on('disconnect', () => {
      console.log('A client disconnected');
      clearInterval(dataUpdateInterval);
    });
  });

  httpServer.listen(3002, () => {
    console.log('Socket.IO server listening on port 3002');
  });
}

module.exports = { initializeWebSocket };
