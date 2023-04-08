const Message = require("../models/message");
const Chat = require("../models/chat");
const asyncHandler = require("express-async-handler");

const createMessage = asyncHandler(async (req, res) => {
  const { sender, content, chat } = req.body;
  console.log(req.body);

  if (!sender && !content && !chat) {
    console.log("lop");
    console.log(req.body);
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  try {
    const createdMessage = await Message.create({sender: sender, content: content, chat: chat});
    const message = await Message.findOne({ _id: createdMessage._id }).populate(
      "sender",
      "-password"
    );

    await Chat.updateOne({ _id: chat }, { latestMessage: createdMessage });

    
    res.status(200).json({message});
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const viewMessage = asyncHandler(async (req, res) => {
  const { messageId, userId } = req.body;

  // check if the requester is admin

  const added = await Message.findByIdAndUpdate(
    messageId,
    {
      $push: { readBy: userId },
    },
    {
      new: true,
    }
  )

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json({messageId: added,_id});
  }
});
module.exports = { createMessage, viewMessage };