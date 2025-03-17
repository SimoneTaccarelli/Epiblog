import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
    type: String,
    required: true,
  },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Editor", "Admin"],
        default: "Editor",
    },
    profilePic: {
        type: String
    },
    googleId: {
        type: String,
        unique: true
    },

},{timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;