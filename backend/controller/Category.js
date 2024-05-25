import Category from "../models/CategoryModel.js";
import {Op} from "sequelize";

export const getCategories = async(req, res) =>{
    try {
        const response = await Category.findAll({
            where : {
                status : 1
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getCategoryById = async(req, res) =>{
    try {
        const response = await Category.findOne({
            where:{
                uuid: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createCategory = async(req, res) =>{
    const {name} = req.body;
    const status = 1;
    try {
        await Category.create({
            name: name,
            status: status,
        });
        res.status(201).json({msg: "Create Category Successfully"});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
}

export const updateCategory = async(req, res) =>{
    const category = await Category.findOne({
        where:{
            uuid: req.params.id
        }
    });
    if(!category) return res.status(404).json({msg: "No Data Found"});
    const {name} = req.body;
    try {
        await category.update({
            name : name,
            status : 1
        },{
            where:{
                id : category.id
            }
        });
        res.status(200).json({msg: "Category Updated Succcessfully"});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
}

export const deleteCategory = async(req, res) =>{
    const category = await Category.findOne({
        where:{
            uuid: req.params.id
        }
    });
    if(!category) return res.status(404).json({msg: "No Data Found"});
    try {
        await Category.update({
            status : 0
        },{
            where:{
                id : category.id
            }
        });
        res.status(200).json({msg: "Category Deleted Succcessfully"});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
}

