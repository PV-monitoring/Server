const express = require("express");
const http = require('http');
const cors = require("cors");
const { initializeWebSocket } = require('./sockets/socketsHandler.js');
const {
    CLIENT_URL
} = require('./utils/constants.js');

const inverterRoutes = require('./routes/inverter.route.js');
const plantRoutes = require('./routes/plant.route.js');

const signupRouter = require("./routes/signup.js");
const loginRouter = require("./routes/login.js");

require("dotenv").config();
require("./services/python_exec.js").monitorDatabase();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
}));
// signup and login routes

app.use("/register", signupRouter);
app.use("/login", loginRouter);

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
app.use('/plant', plantRoutes);

const PORT = process.env.PORT || 5001;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});