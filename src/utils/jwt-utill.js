import { promisify } from "util";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); //.env 사용
const secret = process.env.SECRET;
// const secret = process.env.SECRET;
// const time = 1000 * 60 * 10; //10분

export default {
  sign: (user) => {
    // access token 발급
    const payload = {
      // access token에 들어갈 payload
      email: user.email,
      username: user.name,
      //   role: user.role,
    };

    return jwt.sign(payload, secret, {
      // secret으로 sign하여 발급하고 return
      algorithm: "HS256", // 암호화 알고리즘
      // expiresIn: "1m", // 유효기간
      expiresIn: "1h", // 유효기간
    });
  },
  verify: (token) => {
    // access token 검증
    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
      console.log("디코디드", decoded);
      return {
        ok: true,
        email: decoded.email,
        username: decoded.username,
        // role: decoded.role,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },
};
