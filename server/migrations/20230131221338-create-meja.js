"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("meja", {
      id_meja: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
      },
      nomor_meja: {
        type: Sequelize.STRING(100),
      },
      status: {
        type: Sequelize.ENUM("kosong", "terisi"),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("meja");
  },
};
