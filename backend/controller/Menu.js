import Menu from "../models/MenuModel.js";
import Category from "../models/CategoryModel.js";
import path from "path";
import fs from "fs";
import {Op} from "sequelize";

export const getMenus = async(req, res) => {
    try {
        const response = await Menu.findAll({
                include:[{
                    model : Category,
                    attributes:['name']
                }],
                where:{
                        status : 1
                    }
            });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
}

export const getMenuById = async(req, res) => {
    try {
        const menu = await Menu.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!menu) return res.status(404).json({msg: "Data tidak ditemukan"});

        const response = await Menu.findOne({
            where:{
                id : menu.id
            },
            include:[{
                model : Category,
                attributes:['name']
            }]
        })
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
}

export const createMenu = async(req, res) => {
    if(req.files === null) return res.status(400).json({msg:"No File Uploaded"});
    const name = req.body.title;
    const price = req.body.price;
    const categoryId = req.body.category;
    const status = 1;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg : err.message});
        try {
            await Menu.create({
                name: name,
                image: fileName,
                price : price,
                categoryId : categoryId,
                url: url,
                status: status,
            });
            res.status(201).json({msg: "Menu Created Sucessfully"});
        } catch (error) {
            res.status(500).json({msg : error.message});
        }
    })
}

export const updateMenu = async(req, res) => {
    const menu = await Menu.findOne({
        where:{
            uuid: req.params.id
        }
    });
    if(!menu) return res.status(404).json({msg: "Data tidak ditemukan"});

    let fileName = "";
    // ada masalah disini  ketika gambarnya tidak diganti gambarnya hilang
    if(req.files === null){
        console.log(menu.image);
        fileName = menu.image;
        // console.log("masuk sini");
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

        const filepath = `./public/images/${menu.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg : err.message});
        });
    }
    const name = req.body.title;
    const price = req.body.price;
    const categoryId = req.body.category;
    const status = 1;

    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    try {
        await Menu.update({
            name: name,
            image: fileName,
            url: url,
            price: price,
            categoryId: categoryId,
            status: status
        },{
            where:{
                id: menu.id
            }
        });
        res.status(200).json({msg: "Menu Updated Succcessfully"});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
}

export const deleteMenu = async(req, res) => {
    const menu = await Menu.findOne({
        where:{
            uuid: req.params.id
        }
    });
    if(!menu) return res.status(404).json({msg: "Data tidak ditemukan"});
    try {
        await Menu.update({
            status : 0
        },{
            where:{
                id:menu.id
            }
        })
        res.status(200).json({msg: "Menu Deleted Succcessfully"});
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
}



