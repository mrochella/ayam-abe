import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } =  Sequelize;

const Transaction = db.define('transaction', {
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
      statusPembayaran: {
        type:  DataTypes.STRING,
        allowNull: false,
      },
      tipePesanan: {
        type:  DataTypes.STRING,
        allowNull: false,
      },
      total: {
        type:  DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      tokenPembayaran: {
        type:  DataTypes.STRING,
        allowNull: false,
      },
      tipePembayaran: {
        type:  DataTypes.STRING,
        allowNull: false,
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
    receivedAmount: {
        type:  DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    changeAmount: {
        type:  DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
},{
    freezeTableName : true
});

Users.hasMany(Transaction);
Transaction.belongsTo(Users, {foreignKey: 'userId'});


export default Transaction;