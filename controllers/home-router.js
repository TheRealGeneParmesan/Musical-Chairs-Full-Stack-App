const router = require("express").Router();
const { User, Post } = require("../models");
const withAuth = require("../util/withAuth");

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

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render("home", {
      title: "My Home Page",
      isLoggedIn: req.session.isLoggedIn,
      posts,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to select specific post

router.get("/post/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render("post", {
      title: "Posts",
      isLoggedIn: req.session.isLoggedIn,
      post,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// creates the music route (addedLoggedIn = true to get it to display nav)
router.get("/music", withAuth, async (req, res) => {
  const isLoggedIn = true;
  res.render("music", { title: "Music", isLoggedIn });
});

// get all post and join with user data
router.get("/profile", withAuth, async (req, res) => {
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

// Use withAuth middleware to prevent access to route
router.get("/profile/:id", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.userId, {
      attributes: { exclude: ["password"] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render("profile", {
      ...user,
      isLoggedIn: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Takes us to login page

router.get("/login", (req, res) => {
  res.render("login", { title: "Log-In Page" });
});

// Takes us to signup page

router.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign-Up Page" });
});

module.exports = router;
