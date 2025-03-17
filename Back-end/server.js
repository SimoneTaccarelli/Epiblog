import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/users.js";
import postRouter from "./routes/posts.js";
import open from "open";
import commentrouter from "./routes/comments.js";
import session from "express-session";
import passport from "./utilities/passport.js";
import authRouter from "./routes/auth.js";

// configure dotenv
dotenv.config();

// create server
const server = express();



// middleware di base
server.use(express.json());
server.use(cors());

// configurazione sessione
server.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// inizializzazione passport (dopo la sessione)
server.use(passport.initialize());
server.use(passport.session());

// connect to MongoDB
mongoose.connect(process.env.Mongo_URL, {});

// check if connected to MongoDB
mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
    console.log("Error", err);
});

// create routes
const router = express.Router();

// routes

server.use("/posts", postRouter);
server.use("/comments", commentrouter);
server.use("/auth", authRouter);

// listen to server
server.listen(4000, async () => {
    console.log("Server is running on port 4000");
    await open ("http://localhost:4000");
});
