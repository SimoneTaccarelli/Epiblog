import express from "express";
import Comments from "../models/Comments.js";

const router = express.Router();

// GET comments for a specific post
router.get("/post/:postID", async (req, res) => {
  try {
    const comments = await Comments.find({ post: req.params.postID })
      .populate("author", "firstName lastName profilePic") // Popola i dettagli dell'utente
      .sort({ createdAt: -1 }); // Ordina i commenti in ordine decrescente di creazione

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new comment
router.post("/", async (req, res) => {
  console.log("Ricevuta richiesta POST /comments");
  console.log("Dati della richiesta:", req.body);

  const { comment, author, post } = req.body;

  if (!author) {
    return res.status(400).json({ message: "User is required" });
  }

  try {
    const newComment = new Comments({
      comment,
      author,
      post
    });
    const savedComment = await newComment.save();
    // Popola i dettagli dell'utente
    const populatedComment = await Comments.findById(savedComment._id).populate("author", "firstName lastName profilePic");
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Errore durante il salvataggio del commento:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a comment
router.delete("/:commentId", async (req, res) => {
  try {
    const comment = await Comments.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Verifica se l'autore del commento corrisponde all'autore specificato nella richiesta
    if (comment.author.toString() !== req.body.author) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

    await Comments.deleteOne({ _id: req.params.commentId }); 
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;