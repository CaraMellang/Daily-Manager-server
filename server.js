import express from "express";
import cors from "cors";

const app = express();
const route = express.Router();

let corsOption = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use("/auth", cors(corsOption));

app.listen(5000);
