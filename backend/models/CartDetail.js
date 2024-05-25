import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Cart from "./CartModel.js";
import Menu from "./MenuModel.js";

const { DataTypes } = Sequelize;

const CartDetail = db.define('cartDetail', {
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate : {
            notEmpty : true
        }
    },
    menuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate : {
            notEmpty : true
        }
    },
    cartId : {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate : {
            notEmpty : true
        }
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    subTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
});

Cart.hasMany(CartDetail, { foreignKey: 'cartId' });
CartDetail.belongsTo(Cart, { foreignKey: 'cartId' });

Menu.hasMany(CartDetail, {foreignKey: 'menuId'});
CartDetail.belongsTo(Menu, { foreignKey: 'menuId'});

export default CartDetail