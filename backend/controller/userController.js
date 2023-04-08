const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { firstName,  lastName, email, password } = req.body;
  console.log(req.body);
  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  
  const user = await User.create({firstName, lastName, email, password});
  if(user) {
    const {_id, name, email, isAdmin, avatar } = user;
    res.status(201).json({
      _id,
      name,
      email,
      isAdmin,
      avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(500);
    throw new Error("User not found");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  const user = await User.findOne({ email: email });
  console.log(user);

  if (user && (await user.matchPassword(password))) {
    console.log(user.name())
    res.json({
      _id: user._id,
      name: user.name(),
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { firstName: { $regex: req.query.search, $options: "i" } },
          { lastName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).select("-password");
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers};