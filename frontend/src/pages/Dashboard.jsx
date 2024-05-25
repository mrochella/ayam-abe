import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import Welcome from "../components/Welcome";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const formatRupiah = (value) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  });
  return formatter.format(value);
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

  const [penjualan, setPenjualan] = useState([]);
  const [transaksipesanan, setTransaksiPesanan] = useState([]);
  const [totalpendapatan, setTotalPendapatan] = useState(0);
  const [pendingnumber, setPendingNumber] = useState(0);
  const [completenumber, setCompleteNumber] = useState(0);

  useEffect(() => {
    getTransaksiDetails();
    getTransaksi();
  }, []);


  const menuStats = penjualan.reduce((acc, item) => {
    const { menuId, menu, qty, subTotal } = item;
    const { name } = menu;
    console.log("id nya " + name);
  
    if (!acc[menuId]) {
      acc[menuId] = { name, totalQty: 0, totalRevenue: 0 };
    }
  
    acc[menuId].totalQty += qty;
    acc[menuId].totalRevenue += parseFloat(subTotal);
  
    return acc;
  }, {});

  const pesananStats = transaksipesanan.reduce((acc, item) => {
    const { statusPembayaran } = item;
  
    if (statusPembayaran === "pending") {
      acc.pendingNumber = (acc.pendingNumber || 0) + 1;
    } else if (statusPembayaran === "Complete") {
      acc.completeNumber = (acc.completeNumber || 0) + 1;
    }
  
    return acc;
  }, { pendingNumber: 0, completeNumber: 0 });

  useEffect(() => {
    // Calculate total gross income
    const pendapatanKotor = Object.values(menuStats).reduce(
      (total, menu) => total + menu.totalRevenue,
      0
    );
   // setTotalPendapatan(pendapatanKotor);
  }, [menuStats]);

  const getTransaksiDetails = async () => {
    const response = await axios.get("http://localhost:5000/details");
    setPenjualan(response.data);
  };

  
  const getTransaksi = async () => {
    const response = await axios.get("http://localhost:5000/transactions");
    setTransaksiPesanan(response.data);
  }

  //versi sql nya 3 function 
  const getTotalPendapatan = async () => {
    const response = await axios.get("http://localhost:5000/getTotalPendapatan");
    setTotalPendapatan(response.data[0].TotalPendapatan);
  }

  const getTotalPending = async () => {
    const response = await axios.get("http://localhost:5000/getTotalPending");
    setPendingNumber(response.data[0].PendingOrdersCount);
  }

  const getTotalComplete = async () => {
    const response = await axios.get("http://localhost:5000/getTotalComplete");
    setCompleteNumber(response.data[0].CompleteOrdersCount);
  }

  useEffect(()=>{
    getTotalPendapatan();
    getTotalPending();
    getTotalComplete();
  },[]);

 

  return (
    <Layout>
      <Welcome />
      <div className="container mt-6 ml-2 .container.is-widescreen">
        <div className="is-flex flex-wrap is-flex-direction-row is-justify-content-space-around">
          <div
            className="box is-flex"
            style={{
              width: "350px",
              height: "140px",
              backgroundColor: "orange",
              color: "white",
            }}
          >
            <div className="is-flex is-flex-direction-column">
              <p className="is-size-5 has-text-weight-semibold">
                Pendapatan Kotor
              </p>
              <p className="is-size-3 is-align-self-center">{formatRupiah(totalpendapatan)}</p>
            </div>
          </div>
          <div
            className="box is-flex"
            style={{
              width: "350px",
              height: "140px",
              backgroundColor: "rebeccapurple",
              color: "white",
            }}
          >
            <div className="is-flex is-flex-direction-column">
              <p className="is-size-5 has-text-weight-semibold">
                Pending Order
              </p>
              <p className="is-size-3 ">{pendingnumber}</p>
            </div>
          </div>
          <div
            className="box is-flex"
            style={{
              width: "350px",
              height: "140px",
              backgroundColor: "dodgerblue",
              color: "white",
            }}
          >
            <div className="is-flex is-flex-direction-column">
              <p className="is-size-5 has-text-weight-semibold">
                Complete Order
              </p>
              <p className="is-size-3">{completenumber}</p>
            </div>
          </div>
        </div>
        <div>
          <p className="is-size-4 ml-5 mt-5 has-text-weight-bold">
            {" "}
            Ringkasan Penjualan
          </p>
          <table className="table is-striped is-fullwidth">
            <thead>
              <tr style={{ backgroundColor:"orange", color: "white" }}>
                <th>No</th>
                <th>Menu</th>
                <th>Menu Terjual</th>
                <th>Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(menuStats).map((menuId, index) => {
                const menu = menuStats[menuId];
                return (
                  <tr key={menuId}>
                    <td>{index + 1}</td>
                    <td>{menu.name}</td>
                    <td>{menu.totalQty}</td>
                    <td>{formatRupiah(menu.totalRevenue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
