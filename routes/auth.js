// import express from "express";
const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();

router.post("/signin", (req, res) => {
  const {
    body: { username, password },
  } = req;
  console.log("리퀘에용", username, password);
  res.send({ username: "헬로!!", createdAt: "123" });
});

// export default router;
module.exports = router;
