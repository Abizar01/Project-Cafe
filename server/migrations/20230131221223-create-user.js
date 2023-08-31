"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user", {
      id_user: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
      },
      nama_user: {
        type: Sequelize.STRING(100),
      },
      role: {
        type: Sequelize.ENUM("admin", "kasir", "manajer"),
      },
      username: {
        type: Sequelize.STRING(100),
      },
      password: {
        type: Sequelize.TEXT,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user");
  },
};
