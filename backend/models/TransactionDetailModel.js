import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Transaction from "./TransactionModel.js";
import Menu from "./MenuModel.js";

const {DataTypes} =  Sequelize;


const TransactionDetail = db.define('transactionDetail', {
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
    transactionId : {
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
},{
    freezeTableName : true
});

Transaction.hasMany(TransactionDetail, { foreignKey: 'transactionId' });
TransactionDetail.belongsTo(Transaction, { foreignKey: 'transactionId' });

Menu.hasMany(TransactionDetail, {foreignKey: 'menuId'});
TransactionDetail.belongsTo(Menu, { foreignKey: 'menuId'});

export default TransactionDetail;