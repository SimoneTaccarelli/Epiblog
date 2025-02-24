import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    readTime: {
        Value : {
            type: Number,
            required: true,
        },
        Unit : {
            type: String,
            required: true,
        },},
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    }, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;