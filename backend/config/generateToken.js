const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "pop", {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
