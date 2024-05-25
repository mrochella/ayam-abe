import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Category from "./CategoryModel.js";

const {DataTypes} = Sequelize;

const Menu = db.define('menu',{
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
    price:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate : {
            notEmpty : true
        }
    },
    categoryId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate : {
            notEmpty : true
        }
    },
    status : DataTypes.INTEGER,
    image: DataTypes.STRING,
    url: DataTypes.STRING

},{
    freezeTableName: true
});


// foreign key Category
Category.hasMany(Menu);
Menu.belongsTo(Category, {foreignKey: 'categoryId'});

export default Menu;