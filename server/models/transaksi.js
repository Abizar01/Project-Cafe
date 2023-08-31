"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaksi.belongsTo(models.user, {
        foreignKey: "id_user",
        as: "user",
      });
      transaksi.belongsTo(models.meja, {
        foreignKey: "id_meja",
        as: "meja",
      });
      transaksi.hasMany(models.detail_transaksi, {
        foreignKey: "id_transaksi",
        as: "detail_transaksi",
        onDelete: "CASCADE",
      });
    }
  }
  transaksi.init(
    {
      id_transaksi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tgl_transaksi: DataTypes.DATE,
      id_user: DataTypes.INTEGER,
      id_meja: DataTypes.INTEGER,
      nama_pelanggan: DataTypes.STRING,
      status: DataTypes.ENUM("belum_bayar", "lunas"),
    },
    {
      sequelize,
      modelName: "transaksi",
      tableName: "transaksi",
      timestamps: false,
    }
  );
  return transaksi;
};
