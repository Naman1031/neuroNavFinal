import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
  console.log(req.cookies);
  try {
    const token = req.cookies;
    if (!token) {
      return res.status(400).json({ message: "Unauthorised! Please Login" });
    }
    const verifiedToken = jwt.verify(token.jwt, process.env.JWT_SECRET);
    if (!verifiedToken) {
      return res.status(400).json({ message: "Invalid Token" });
    }
    const user = await User.findById(verifiedToken.userId);
    req.userID = user._id;
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token at catch in middleware" });
  }
};
