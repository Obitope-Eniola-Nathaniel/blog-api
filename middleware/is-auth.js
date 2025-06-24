const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.TOKEN;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, "secret");
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
