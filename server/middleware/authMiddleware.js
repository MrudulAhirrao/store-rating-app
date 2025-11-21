
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET ;

exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: "Access Denied. Admins only." });
  }
  next();
};