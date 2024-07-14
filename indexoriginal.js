const express = require("express");
const http = require('http');
const { Server } = require("socket.io");
const cors = require("cors");
const { initializeWebSocket } = require('./sockets/socketsHandler.js');
require("dotenv").config();

const inverterRoutes = require('./routes/inverter.route');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
}));
// middleware & static files
app.use(express.urlencoded({ extended: true }));

initializeWebSocket(server);

// set static file path for production build
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

//root path
app.get('/', (req, res) => {
    res.send("Welcome...!");
});

// API routes
app.use('/inverter', inverterRoutes);

const PORT = process.env.PORT || 5001;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});