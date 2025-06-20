const expreess = require('express');
const router = expreess.Router();

const Post = require('../models/post');
const Comment = require('../models/comment');

// create a new post
// POST /api/posts
router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    // console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single post with comments
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json({ post, comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// add a comment to a post
router.post('/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const comment = new Comment({
      postId: req.params.id,
      ...req.body
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;