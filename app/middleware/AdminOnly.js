const jwt = require("jsonwebtoken");

const AdminOnly = (req, res, next) => {
  const { adminToken } = req.cookies || {};
  const secret = process.env.JWT_SECRET || "your_jwt_secret_key";

  if (!adminToken) {
    return res.redirect("/");
  }

  jwt.verify(adminToken, secret, (err, data) => {
    if (err) return res.redirect("/");

    req.user = data; //  use req.user consistently
    next();
  });
};

module.exports = AdminOnly;
