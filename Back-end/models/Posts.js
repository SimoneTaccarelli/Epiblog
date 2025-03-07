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
    description: {
        type : String
    },
    readTime: {
        value : {
            type: Number,
            required: true,
        },
        unit : {
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