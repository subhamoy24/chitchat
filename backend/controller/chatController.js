const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
const { response } = require("express");
const { chatResponse } = require("../serializer/chatResponse");

const createGroup = asyncHandler(async (req, res) => {
  const {users, admin, chatName} = req.body;
  console.log(users, admin, chatName)
  const chat = await Chat.create({chatName: chatName, users: users, isGroupChat: true, groupAdmin: admin});
  const FullChat = await Chat.findOne({ _id: chat._id }).populate(
    "users",
    "-password"
  );
  
  res.status(200).json({chat:FullChat, messages: []});
});

const accessChat = asyncHandler(async (req, res) => {
  const { userId1, userId2 } = req.body;

  if (!userId1 && !userId2) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: userId1} } },
      { users: { $elemMatch: { $eq: userId2 } } },
    ],
  }).populate("users", "-password").populate("latestMessage");

  console.log(isChat);
  if (isChat) {
    const messages = await Message.find({chat: isChat._id}).populate("sender", "-password");
    res.json({chat: isChat, messages});
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [userId1, userId2],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json({chat:FullChat, messages: []});
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const chatDetails = asyncHandler(async (req, res) => {
  const { chatId } = req.query;
  if (!chatId) {
    console.log("Chat param not sent with request");
    return res.sendStatus(400);
  }

  const isChat = await Chat.findOne({_id: chatId}).populate("users", "-password").populate("latestMessage");

  if (isChat) {
    const messages = await Message.find({chat: isChat._id}).populate("sender", "-password");
    res.status(200).json({chat: isChat, messages: messages});

  }
});

const userChats = asyncHandler(async (req, res) => {
  const {userId} = req.query;

  
  const chats =  await Chat.find({ users: { $elemMatch: { $eq: userId} } }).populate("users", "-password").populate("latestMessage").sort({updatedAt: -1});
  const results =  await chatResponse(chats, userId);
  res.status(200).json(results);
});

const viewChat = asyncHandler(async (req, res) => {
  const {chatId, userId} = req.query;

  
  await Message.updateMany({chat: chatId, readBy: [], sender:{ $ne: userId}},  {
    $push: { readBy: userId },
  });

  res.status(200).json({chatId: chatId});
});
module.exports = { accessChat, chatDetails, userChats, viewChat, createGroup };


