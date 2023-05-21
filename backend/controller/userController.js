const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const generateToken = require("../config/generateToken");
const {OAuth2Client}  = require("google-auth-library");

const googleClient = new OAuth2Client({
  clientId: "187101791284-lm06bsrnuij7o50q4641al592lot350d.apps.googleusercontent.com"
});

const registerUser = asyncHandler(async (req, res) => {
  const {firstName, lastName, email, password, token} = req.body;
  if(token) {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audient: "187101791284-lm06bsrnuij7o50q4641al592lot350d.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    console.log(payload);

    let user = await User.findOne({ email: payload?.email });
    if (!user) {
      userName = payload.name.split(" ");
      user = await new User({
        email: payload?.email,
        password: "abcd",
        avatar: payload?.picture,
        firstName: userName[0],
        lastName: userName[1],
      });
  
      await user.save();

      res.json({
        _id: user._id,
        name: user.name(),
        email: user.email,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(500);
      throw new Error("User not found");
    }

    return
  }

  console.log(req.body);
  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  
  const user = await User.create({firstName, lastName, email, password});
  if(user) {
    res.json({
      _id: user._id,
      name: user.name(),
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(500);
    throw new Error("User not found");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password, token } = req.body;
  console.log(email, password);

  if(token) {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audient: "187101791284-lm06bsrnuij7o50q4641al592lot350d.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    console.log(payload);

    let user = await User.findOne({ email: payload?.email });
    if (user) {
      res.json({
        _id: user._id,
        name: user.name(),
        email: user.email,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(500);
      throw new Error("User not found");
    }

    return
  }

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

  const page = req.query.page;

  const users = await User.find(keyword).select("-password").limit(10).skip((page - 1)*10);
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers};