const router = require("express").Router();
const { Post, User } = require("../../models");
const withAuth = require("../../util/withAuth");

// get all post and join with user data
router.get("/", withAuth, async (req, res) => {
  try {
    const userHistory = await User.findOne({
      where: { id: req.session.userId },
      include: [
        {
          model: Post,
        },
      ],
    });

    // serialize data for template to read
    const posts = userHistory.Posts.map((post) => post.get({ plain: true }));

    // pass serialized data and session flag into template
    res.render("profile", {
      title: "My Dashboard",
      isLoggedIn: req.session.isLoggedIn,
      posts,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// getting specific post
router.get("/post/:id", async (req, res) => {
  try {
    const postHistory = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const post = postHistory.get({ plain: true });
    console.log(post);

    res.render("post", {
      ...post,
      isLoggedIn: req.session.isLoggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a post
router.post("/", withAuth, async (req, res) => {
  try {
    const postData = await Post.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.session.userId,
      song_url: req.body.song_url,
      artist: req.body.artist,
      album: req.body.album,
    });
    return res.status(200).json(postData);
  } catch (error) {
    console.error(error);
    res.status(500).send("⛔ Uh oh! An unexpected error occurred.");
  }
});

module.exports = router;
