// Dependencies //
const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {userJoin, getCurrentUser, userLeave, getRoomUsers,} = require("./utils/users");
const app = express();

// Access to Server to use Socket.io //
const server = http.createServer(app);
const io = socketio(server);

// Static Folder //
app.use(express.static(path.join(__dirname, "public")));

// Admin Messages //
const adminName = "Admin";

// Run When Client Connects //
io.on("connection", (socket) => {

// Connects to Username and Room on main.js side //
  socket.on("joinRoom", ({ username, room }) => {

// Takes in an ID, USERNAME, and a ROOM //
    const user = userJoin(socket.id, username, room);

// Room That the User Joins, Which Comes From the URL //
    socket.join(user.room);

// Sends a Message to Connecting User Only, When Entering Chat //
    socket.emit("message", formatMessage(adminName, "Welcome to Chat App!"));

// Broadcasts to Everyone in Chat, When a User Joins //
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(adminName, `${user.username} has joined the chat!`)
      );

// Send User and Room Info //
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for 'chatMessage' //
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Broadcasts to Everyone in Chat, When a User Leaves //
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(adminName, `${user.username} has left the chat`)
      );

      // Send User and Room Info //
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

// Server Setup //
// Looks for Environment Variable Named PORT, if Not, Use 3000 //
const PORT = process.env.PORT || 3000;

// Start Server //
// Creates a listener on the specified PORT //
server.listen(PORT, () => {
  console.log("*******************************");
  console.log(`Server is running on port ${PORT}`);
  console.log("*******************************");
});
