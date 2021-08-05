"use strict";

const defineModels = require(`../models`);
const Aliases = require(`../models/aliases`);

module.exports = async (sequelize, {categories, posts}) => {
  const {Category, Post} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  const postPromises = posts.map(async (post) => {
    const postModel = await Post.create(post, {include: [Aliases.COMMENTS]});
    await postModel.addCategories(
        post.categories.map(
            (name) => categoryIdByName[name]
        )
    );
  });
  await Promise.all(postPromises);
};
