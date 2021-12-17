import { promisify } from "util";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); //.env 사용
const secret = process.env.SECRET;

export default {
  sign: (user) => {
    const payload = {
      email: user.email,
      username: user.name,
    };

    return jwt.sign(payload, secret, {
      algorithm: "HS256", 
      expiresIn: "1h", 
    });
  },
  verify: (token) => {
    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
      console.log("디코디드", decoded);
      return {
        ok: true,
        email: decoded.email,
        username: decoded.username,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },
};
