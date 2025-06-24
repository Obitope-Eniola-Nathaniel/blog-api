const expreess = require("express");
const { body } = require("express-validator");

const postController = require("../controllers/posts");
const isAuth = require("../middleware/is-auth");

const router = expreess.Router();

// POST /api/posts/post
router.post(
  "/post",
  isAuth,
  [
    body("title")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Title must be at least 5 characters long."),
    body("content")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Content must be at least 5 characters long."),
  ],
  postController.createPost
);

// get all posts
// GET /api/posts/posts
router.get("/posts", postController.getPosts);

router.get("/getpost/:id", isAuth, postController.getSinglePost);

// add a comment to a post
// POST /api/posts/:id/comment
router.post(
  "/:id/comment",
  isAuth,
  [
    body("content")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Comment content must not be empty."),
  ],
  postController.addComment
);

module.exports = router;
