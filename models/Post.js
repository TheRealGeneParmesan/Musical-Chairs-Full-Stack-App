const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

// create our Post model
class Post extends Model {
  // set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    return bcrypt.compare(loginPw, this.password);
  }
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    song_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    artist: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    album: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
        uniqure: false,
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: "Post",
  }
);

module.exports = Post;
