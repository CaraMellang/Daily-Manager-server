import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const saltRounds = 8; //salt 돌리는 횟수.(hasing 랜덤하게)

// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

export const signUpUser = () => {
  const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    createdAt: { type: Date },
  });
  // user.findOne({ email: email }).then((res) => {
  //   if (res !== null) {
  //     console.log("이미 있는 아이디 입니다.");
  //     return;
  //   }
  //   // const User = new UserModel({ name, email, password, createdAt: currDate });

  //   // Mongoose의 pre메소드는 `Register Controller`의 *save메소드*가 실행되기 전에 실행된다.
  //   // save되기 전에 Hashing을 하기 위해 pre메소드 내부에 Hash Function 작성

  //   // User.save().then(() => console.log("유저 저장완료"));
  // });

  userSchema.pre("save", function (next) {
    //arrow function 지원안함 ㅋㅋ 엌ㅋㅋㅋ
    const user = this; //userSchema를 가리킴

    if (user.isModified("password")) {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hashedPassword) {
          if (err) return next(err);
          user.password = hashedPassword; //성공하면 바꿈.
          next(); //해싱 끝나면 다음으로(save)
        });
      });
    } else {
      next(); //바로save로감? 아닌듯
    }
  });

  return mongoose.model("users", userSchema);
};
