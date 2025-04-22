const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: "Token manquant" });
  
  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
    console.log("user",user)
    console.log("err",err)
    if (err) return res.status(403).json({ message: "Token invalide" });
    req.user = user;
    next();
  });
  } catch (error) {
    console.error("           :",error)
  }
};

module.exports = authenticateToken;
