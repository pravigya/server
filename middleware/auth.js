const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const token = req.cookie.token;

    if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });

    const verified = jwt.verify(token, process.env.JWR_SECRET);
    req.user = verified.user;
    next();
  } catch (err) {
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
}

module.exports = auth;
