"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transaksi", {
      id_transaksi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
      },
      tgl_transaksi: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      id_user: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "user",
          key: "id_user",
        },
      },
      id_meja: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "meja",
          key: "id_meja",
        },
      },
      nama_pelanggan: {
        type: Sequelize.STRING(100),
      },
      status: {
        type: Sequelize.ENUM("belum_bayar", "lunas"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transaksi");
  },
};
