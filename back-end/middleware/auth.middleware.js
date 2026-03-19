const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {

  const token = req.cookies.authToken;
  if (!token) {
    console.log("no token found in cookie");
    return res.status(401).json({ message: "unauthorised" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res.status(401).json({ message: "unauthorised" });
    } else {
      req.currentUser = data;
      next();
    }
  });
};
module.exports = authenticate;
