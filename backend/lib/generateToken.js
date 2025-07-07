import jwt from "jsonwebtoken";

// Generate a user token
const generateToken = (user) => {
  const token = jwt.sign({ user }, process.env.JWT_SECRET);
  return token;
};

export default generateToken;
