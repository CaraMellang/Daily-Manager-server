import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userSchema } from "../schema/user.js";

const saltRounds = 8; 


const userModel = () => {
  userSchema.pre("save", function (next) {
    
    const user = this; 

    if (user.isModified("password")) {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hashedPassword) {
          if (err) return next(err);
          user.password = hashedPassword;
          next(); 
        });
      });
    } else {
      next();
    }
  });

  return mongoose.model("users", userSchema);
};

export default userModel;
