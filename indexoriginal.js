// const express = require("express");
// const cors = require("cors");

// const signupRouter = require("./routes/signup.js");
// const loginRouter = require("./routes/login.js");

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use("/", signupRouter);
// app.use("/", loginRouter);

// app.listen(3002, () => {
//   console.log("Server is running .....");
// });

// require("dotenv").config();
// const express = require("express");
// const { SignIn } = require("./connect");
// // const config = require("./config.json")
// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");

// const app = express();

// app.use(express.json());

// app.post("/save", async (req, res) => {
//   await SignIn();
//   res.send("OK");
// });

// app.get("/", async (req, res) => {
//   try {
//     const config = await fs.readFileSync(path.join(__dirname, "config.json"));
//     const token = JSON.parse(config.toString());

//     const _res = await axios.post(
//       "http://openapi.semsportal.com/api/OpenApi/GetUserPlantList",
//       { page_index: 1, page_size: 10 },
//       {
//         headers: {
//           token: token.token,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (_res.data.code === 100002) {
//       const _token = await SignIn();
//       const _res = await axios.post(
//         "http://openapi.semsportal.com/api/OpenApi/GetUserPlantList",
//         { page_index: 1, page_size: 10 },
//         {
//           headers: {
//             token: _token,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     }
//     res.json({ mydata: _res.data });
//     // res.json({mydata:config})
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error });
//   }
// });

// app.listen(3000, () => {
//   console.log("Server Running");
// });
