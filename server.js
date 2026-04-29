const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", (room) => {
    socket.join(room);
    console.log("Joined room:", room);
  });

  socket.on("move", (data) => {
    socket.to(data.room).emit("move", data);
  });
});

server.listen(3000, () => console.log("Server running"));
