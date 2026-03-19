const express = require("express");
const cors = require("cors");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dbconnect = require("./config/dbconfig");
require("dotenv").config();
const userRoutes = require("./routes/user.routes");
const botRoutes = require("./routes/getBots.routes");
const userModel = require("./model/user.model");
const { botsocket } = require("./controller/bot.controller");
const http = require("http");
const { Server } = require("socket.io");
const allowedOrigins = process.env.BASE_URL.split(",").map((origin) =>
  origin.trim(),
);

const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      // allow REST tools, mobile apps, etc.
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// app.use(cors({ origin: "https://dashboard-henna-nu-36.vercel.app", credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use(userRoutes);
app.use(botRoutes);

dbconnect();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  try {
    const cookies = cookie.parse(socket.request.headers.cookie || "");
    const token = cookies.authToken;

    if (!token) {
      console.log("No Token found, DIsconnecting!");
      socket.disconnect(true);
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      console.log("Invalid user, DIsconnecting!");
      socket.disconnect(true);
      return;
    }

    botsocket(io, socket);
  } catch (err) {
    console.error("Socket auth error:", err.message);
    socket.disconnect(true);
  }
});

server.listen(process.env.PORT, (err) => {
  console.log("server is running");
});
