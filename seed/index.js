require("dotenv").config();
const sequelize = require("../config/connection");
const { User, Post } = require("../models");
const userData = require("./userData.json");
const postData = require("./postData.json");

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    const user = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    for (const post of postData) {
      await Post.create({
        ...post,
        userId: user[Math.floor(Math.random() * user.length)].id,
      });
    }

    console.log("Finished seeding database.");
  } catch (error) {
    console.error(error);
    console.error(
      "An error occurred attempting to seed the database. Scroll up for additional details."
    );
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

seedDatabase();
