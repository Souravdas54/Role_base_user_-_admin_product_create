const jwt = require("jsonwebtoken");

const UserOnly = (req, res, next) => {
  const { userToken } = req.cookies || {};
  const secret = process.env.JWT_SECRET || "your_jwt_secret_key";

  if (!userToken) {
    return res.redirect("/");
  }

  jwt.verify(userToken, secret, (err, data) => {
    if (err) return res.redirect("/");

    req.user = data; // attach user data to request
    next();
  });
};

module.exports = UserOnly;
