import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Cart = db.define('cart', {
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate : {
            notEmpty : true
        }
    },
    tanggal: {
        type:  DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      waktu: {
        type:  DataTypes.TIME,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      tipePesanan: {
        type:  DataTypes.STRING,
        allowNull: false,
      },
      total: {
        type:  DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate : {
            notEmpty : true
        }
      },
      userType: {
        type:  DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['buyer', 'cashier']],
        },
    },
},{
    freezeTableName : true
});

Users.hasMany(Cart);
Cart.belongsTo(Users, {foreignKey: 'userId'});

export default Cart;