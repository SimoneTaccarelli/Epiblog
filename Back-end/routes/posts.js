import e from "express";
import Posts from "../models/Posts.js";
import upload from "../utilities/cloudinary.js";

const router = e.Router();

//get
router.get("/", async (req, res) => {
  try {
    //pagination
    const page = parseInt(req.query.page) || 1;
    //limit is the number of posts per page
    const limit = parseInt(req.query.limit) || 5;
    //startIndex is the starting index of the post
    const startIndex = (page - 1) * limit;

    

    const filter = req.query.author ? { author: req.query.author } : {};

    const totalPosts = await Posts.countDocuments(filter);
    const total = Math.ceil(totalPosts / limit);




    const posts = await Posts.find(filter)
    .populate("author", "firstName lastName profilePic")//populate is used to get the user's name from the user collection
    .limit(limit)
    .skip(startIndex)
    .sort({ createdAt: -1 })

    const filterAuthor = req.query.author ? posts.filter(post => post.author._id.toString() === req.query.author) : posts;
    
    res.status(200).json({
      posts,
      currentPage: page,
      total,
      totalPosts
  });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get single post
/* router.get("/:Id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.Id).populate("author", "firstname lastname");
    res.json(post);
  } catch (error) {
    res.json({ message: error });
  }
}); */

//post
router.post("/", upload.single('cover'),  async (req, res) => {
    try {
    const {title , category , cover , description , readTime , author} = req.body;
    const newPost = new Posts({
    title,
    category,
    cover : req.file.path,
    description,
    readTime : JSON.parse(readTime),
    author
  });
    const savedpost = await newPost.save();

    const populatePost= await Posts.findById(savedpost._id).populate("author", "firstname lastname");
    res.status(201).json(populatePost);
  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
});

//delet post
router.delete("/:postId", async (req, res) => {
  try {
    const userId= req.user._id;
    const userRole = req.user.role; 
    const postId = req.params.postId;

    const post = await Posts.findById(postId);

    if(!post){
      return res.status(404).json({message: "Post not found"});
    }

    if (post.author.toString() !== userId && userRole !== "admin") {
      return res.status(401).json({ message: "You are not authorized to delete this post" });
    }
    await Posts.findByIdAndDelete(postId);

    res.json(201);
  } catch (error) {

    res.status(500).json({ message: error.message });
  }
});

//update post
router.put("/:postId", async (req, res) => {
  try {
    const post = await Posts.findByIdAndUpdate(req.params.postId, req.body, { new: true });

    const modifyPost = await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//post details
router.get("/details/:postId", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.postId).populate("author", "firstName lastName profilePic");
    res.json(post);
  } catch (error) {
    res.json({ message: error });
  }
});
export default router;