import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {IoAdd } from "react-icons/io5";
import axios from "axios";

const CategoryList = () => {
    const [category, setCategory] = useState([]);

    useEffect(() => {
      getCategory();
    }, []);
  
    const getCategory = async () => {
      const response = await axios.get("http://localhost:5000/category");
      setCategory(response.data);
    };
  
    const deleteCategory = async(categoryId) => {
      await axios.delete(`http://localhost:5000/category/${categoryId}`);
      getCategory();
    }
  return (
    <div>
      <h1 className="title">Category</h1>
      <h2 className="subtitle">List of Category</h2>
      <div className="container is-flex is-justify-content-end">
      <Link to="/category/add" className="button is-primary mb-3 mr-4 "><IoAdd className="mr-3"/>Add New</Link>
      </div>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr style={{ backgroundColor:"orange", color: "white" }}>
            <th style={{color: "white" }}>No</th>
            <th></th>
            <th></th>
            <th></th>
            <th  style={{color: "white" }}>Category Name</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th  style={{color: "white" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {category.map((category, index) => (
            <tr key={category.uuid}>
              <td>{index + 1}</td>
              <td></td>
              <td></td>
              <td></td>
              <td>{category.name}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Link to={`/category/edit/${category.uuid}`} className="button is-small is-info">Edit</Link>
                <button onClick={() => deleteCategory(category.uuid)}  className="button is-small is-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CategoryList
