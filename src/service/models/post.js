"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Post extends Model {}

const define = (sequelize) => Post.init({
  announce: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  picture: DataTypes.STRING,
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Post`,
  tableName: `posts`
});

module.exports = define;
