const jwt = require("jsonwebtoken");
const User = require("../models/users");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.send("Token Not Foun by viraj");
    }
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send(error.message);
  }
};

module.exports = auth;
