import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Products from "./ProductModel.js";

const {DataTypes} = Sequelize;

const StockOpname = db.define('stockopname',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate : {
            notEmpty : true
        }
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate : {
            notEmpty : true,
            len: [3, 100]
        }
    },
    tanggal: {
        type:  DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate : {
            notEmpty : true
        }
      },
      tipeOpname : {
        type:  DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['pengeluaran', 'pemasukan']],
        },
      },
      userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate : {
            notEmpty : true
        }
    },
    productId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate : {
            notEmpty : true
        }
    }
},{
    freezeTableName : true
});

Users.hasMany(StockOpname);
StockOpname.belongsTo(Users, {foreignKey: 'userId'});

Products.hasMany(StockOpname);
StockOpname.belongsTo(Products, {foreignKey: 'productId'});

export default StockOpname;