const Message = require("../models/message");

const chatResponse =  async (chats, userId) => {
  res = []
  for(const c of chats) {
    d = {};
    d['_id'] = c._id;
    d['chatName'] = c.chatName;
    d['isGroupChat'] = c.isGroupChat;
    d['users'] = c.users;
    d['latestMessage'] = c.latestMessage;
    d['groupAdmin'] = c.groupAdmin;
    d['unreadMessages'] = await Message.countDocuments({chat: c._id, readBy: [], sender: { $ne: userId}});
    res.push(d);
  }
  return res;
  
}

module.exports = { chatResponse };