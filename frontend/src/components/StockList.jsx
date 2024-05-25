import React, { useState, useEffect } from "react";
import {IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";

const StockList = () => {
    const [stocks, setStocks] = useState([]);

  useEffect(() => {
    getStocks();
  }, []);

  const getStocks = async () => {
    const response = await axios.get("http://localhost:5000/stockopname");
    setStocks(response.data);
  };
  return (
    <div>
      <h1 className="title">Stock Opname</h1>
      <h2 className="subtitle">List of Stock</h2>
      <div className="container is-flex is-justify-content-end">
      <Link to="/stockopname/add" className="button is-primary mb-3 mr-4 "> <IoAdd className="mr-3"/>Add New</Link>
      </div>
      
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr style={{ backgroundColor:"orange", color: "white" }}>
            <th>No</th>
            <th>Tanggal</th>
            <th>Stock Name</th>
            <th>Qty</th>
            <th>Created By</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr key={stock.uuid}>
              <td>{index + 1}</td>
              <td>{new Date(stock.tanggal).toLocaleDateString()}</td>
              <td>{stock.name}</td>
              <td>{stock.qty}</td>
              <td>{stock.user.name}</td>
              <td>{stock.tipeOpname}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StockList
