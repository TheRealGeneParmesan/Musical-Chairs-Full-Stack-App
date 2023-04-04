const router = require("express").Router();
const { User, Post, Comment } = require("../models");
const withAuth = require("../util/withAuth");


// Get all posts 

router.get('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });
    // console.log(postData)

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    console.log(posts)

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

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
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
router.get('/music', withAuth, async (req, res) => {
  const isLoggedIn = true;
  res.render('music', { title: 'Music', isLoggedIn })

});


// post a comment

router.post('/:id/comments', async (req, res) => {
  try {
    const postId = req.params.id;
    const { comment } = req.body;
    const userId = req.session.user_id;

    if (!comment || !userId) {
      return res.status(400).json({ message: 'Comment text and user ID are required' });
    }

    const newComment = await Comment.create({
      comment,
      user_id: userId,
      post_id: postId,
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Allows us to edit a post in the post page (probably should delete this and add to music/post routes)

router.put('/post/:id', async (req, res) => {
  try {
    const postData = await Post.update({
      name: req.body.name,
      description: req.body.description
    }, {
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },

    });
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get to post page


// router.get('/post', withAuth, async (req, res) => {
//   res.render('post', { title: 'Posts' })
// });


// Takes us to profile

// Use withAuth middleware to prevent access to route
router.get('/profile/', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      isLoggedIn: true
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












// search for a specific post? 
// router.get('/post', withAuth, async (req, res) => {
//   try {

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('⛔ Uh oh! An unexpected error occurred.');
//   }
// });




// router.put('/post/:id', withAuth, async (req, res) => {
//   try {
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('⛔ Uh oh! An unexpected error occurred.');
//   }
// });

// router.get('/post', withAuth, async (req, res) => {
//   try {

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('⛔ Uh oh! An unexpected error occurred.');
//   }
// });

// router.post('/post', withAuth, async (req, res) => {
//   try {

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('⛔ Uh oh! An unexpected error occurred.');
//   }
// });

// router.get('/post/:id', withAuth, async (req, res) => {
//   try {

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('⛔ Uh oh! An unexpected error occurred.');
//   }
// });

// router.put('/post/:id', withAuth, async (req, res) => {
//   try {

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('⛔ Uh oh! An unexpected error occurred.');
//   }
// });