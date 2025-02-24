import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/users.js";
import postRouter from "./routes/posts.js";


// configure dotenv
dotenv.config();

// create server
const server = express();

// middleware
server.use(express.json());
server.use(cors());
// connect to MongoDB
mongoose.connect(process.env.Mongo_URL, {
    
});
// check if connected to MongoDB
mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
    console.log("Error", err);
});

// create routes
const router = express.Router();

server.use("/users", userRouter);
server.use("/posts", postRouter);

// listen to server
server.listen(4000, () => {
    console.log("Server is running on port 4000");
});
