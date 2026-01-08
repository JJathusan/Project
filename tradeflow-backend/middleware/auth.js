import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  try {
    if (!process.env.JWT_SECRET) {
      console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
      return res.status(500).json({ message: "Internal Server Configuration Error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error("Token Error:", err.message); // This will show "jwt malformed" or "jwt expired"
    return res.status(400).json({ message: "Invalid Token", error: err.message });
  }
};