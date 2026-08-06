import jwt from "jsonwebtoken";
import { createError } from "../error.js";

const JWT_SECRET = process.env.JWT || "foodeli_secret_jwt_key_2026";

export const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(createError(401, "You are not authenticated!"));
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return next(createError(401, "You are not authenticated!"));
    const decode = jwt.verify(token, JWT_SECRET);
    req.user = decode;
    return next();
  } catch (err) {
    return next(createError(403, "Token is not valid!"));
  }
};
