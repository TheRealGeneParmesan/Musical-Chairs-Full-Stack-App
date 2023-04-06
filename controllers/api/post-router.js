const router = require("express").Router();

const { Post, User } = require("../../models");
const withAuth = require("../../util/withAuth");

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

router.post("/profile", withAuth, async (req, res) => {
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

// Get all posts

router.get("/", withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });
    const post = postData.get({ plain: true });
    res.render("post", {
      title: "Post Page",
      isLoggedIn: req.session.isLoggedIn,
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("⛔ Uh oh! An unexpected error occurred.");
  }
});

// Get an individual post

router.get("/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk({
      where: {
        id: req.params.id,
        userId: req.session.userId,
      },
    });
    const post = postData.get({ plain: true });
    res.render("post", {
      title: "Post Page",
      isLoggedIn: req.session.isLoggedIn,
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("⛔ Uh oh! An unexpected error occurred.");
  }
});

// Update a post
router.put("/:id", async (req, res) => {
  try {
    const postData = await Post.update(
      {
        name: req.body.name,
        description: req.body.description,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.userId,
        },
      }
    );
    if (!postData) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a post

router.delete("/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        userId: req.session.userId,
      },
    });
    if (!postData) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    }
    res.status(200).json(postData);
  } catch (error) {
    console.error(error);
    res.status(500).send("⛔ Uh oh! An unexpected error occurred.");
  }
});

module.exports = router;
