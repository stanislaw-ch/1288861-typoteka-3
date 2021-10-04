'use strict';

const Sequelize = require(`sequelize`);
const Aliases = require(`../models/aliases`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._PostCategory = sequelize.models.PostCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                Sequelize.col(`PostId`)
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._PostCategory,
          as: Aliases.POST_CATEGORIES,
          attributes: []
        }]
      });
      return result.map((it) => it.get());
    }
    return this._Category.findAll({raw: true});
  }

  async countByCategory(id) {
    const result = await this._PostCategory.findAll({
      where: {CategoryId: id}
    });
    const count = result.length;
    return +count;
  }

  async findByName(name) {
    return await this._Category.findOne({where: {name}});
  }

  async create(data) {
    return await this._Category.create({
      name: data
    });
  }

  async update(id, name) {
    return await this._Category.update(
        {name},
        {where: {id}}
    );
  }

  async drop(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = CategoryService;
