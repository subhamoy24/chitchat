const express = require("express");
const app = express()
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const userRoutes = require("./router/userRouter");
const chatRoutes = require("./router/chatRouter");
const messageRoutes = require("./router/messageRouter");
const Chat = require('./models/chat');


const bodyParser = require('body-parser');
const multer = require("multer");
require('dotenv').config()


connectDB();
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use("/api/user", multer().none(), userRoutes);
app.use("/api/chat", multer().none(), chatRoutes);
app.use("/api/message", multer().none(), messageRoutes);


const server = http.createServer(app)

const  io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["POST", "GET"]
  }

});

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    console.log(data);
    socket.join(data);
  });

  socket.on("send_message", async (data) => {
    const chat = await Chat.findOne({_id: data.chatId});

    for(var i = 0; i < chat.users.length; i++){
      console.log(chat.users[i]);
      io.sockets.in(chat.users[i].toString()).emit("receive_message", data.message);
      io.sockets.in(chat.users[i].toString()).emit("receive_chat", data.message);
    };
    
  });
  

  socket.on("disconnect", (data) => {
    console.log(data)
  });


});

server.listen(3001, () => {
  console.log("server running")
})