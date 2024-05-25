import React, { useState, useEffect } from "react";
import {IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const response = await axios.get("http://localhost:5000/products");
    setProducts(response.data);
  };

  const deleteProduct = async(productId) => {
    await axios.delete(`http://localhost:5000/products/${productId}`);
    getProducts();
  }

  return (
    <div>
      <h1 className="title">Inventory</h1>
      <h2 className="subtitle">List of Item</h2>
      <div className="container is-flex is-justify-content-end">
      <Link to="/products/add" className="button is-primary mb-3 mr-4 "> <IoAdd className="mr-3"/>Add New</Link>
      </div>
      
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr style={{ backgroundColor:"orange", color: "white" }}>
            <th>No</th>
            <th>Item Name</th>
            <th>Qty</th>
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.uuid}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.user.name}</td>
              <td>
                <Link to={`/products/edit/${product.uuid}`} className="button is-small is-info">Edit</Link>
                <button onClick={() => deleteProduct(product.uuid)}  className="button is-small is-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
