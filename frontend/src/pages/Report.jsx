import React, {useEffect, useState} from 'react'
import Layout from './Layout';
import OrderList from '../components/OrderList';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMe } from '../features/authSlice';
import {Chart as ChartJS} from "chart.js/auto";
import {Bar, Doughnut, Line} from "react-chartjs-2";
import axios from "axios";

const Report = () => {
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isError} = useSelector((state => state.auth));
  const [msg, setMsg] = useState("");
 

  useEffect(() =>{
    dispatch(getMe());
  },[dispatch]);

  useEffect(() =>{
    if(isError){
      navigate("/");
    }
  },[isError, navigate]);
  
  const [reportdetail, setReportDetail] = useState([]);
  const [reporttransaksi, setReportTransaksi] = useState([]);
  const colors = ['rgba(75,192,192,0.8)', 'rgba(255,99,132,0.8)', 'rgba(255,205,86,0.8)', 'rgba(54,162,235,0.8)', 'rgba(153,102,255,0.8)'];

  useEffect(() => {
    const getTransaksiDetail = async() =>{
        try {
            const response = await axios.get("http://localhost:5000/details")
            setReportDetail(response.data)
        } catch (error) {
            setMsg(error.response.data.msg);
        }
    }

    const getTransactions = async() =>{
        try {
            const response = await axios.get("http://localhost:5000/transactions")
            setReportTransaksi(response.data)
        } catch (error) {
            setMsg(error.response.data.msg);
        }
    }
    getTransactions();
    getTransaksiDetail();
  },[])

  const convertDateToDay = (dateString) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNumber;
  }

  // function getWeek(dateString) {
  //   const date = new Date(dateString);
  //   const weekNumber = getWeekNumber(date);
  //   return `Week ${weekNumber}`;
  // }
  
  // // Fungsi untuk mendapatkan bulan dari tanggal
  // function getMonth(dateString) {
  //   const date = new Date(dateString);
  //   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  //   return monthNames[date.getMonth()];
  // }

   // Grouping transactions by day and calculating total
   const transactionsByDay = reporttransaksi.reduce((acc, data) => {
    const day = convertDateToDay(data.tanggal);
    acc[day] = (acc[day] || 0) + parseFloat(data.total);
    return acc;
  }, {});

  


  const sortedDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

   // Grouping by menuId and calculating sum of qty
   const menuIdMap = reportdetail.reduce((acc, data) => {
    const { menuId, qty } = data;
    acc[menuId] = (acc[menuId] || 0) + qty;
    return acc;
  }, {});

  // Sorting menuIdMap by quantity in descending order
  const sortedMenuIdMap = Object.entries(menuIdMap)
    .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
    .slice(0, 5)
    .reduce((acc, [menuId, qty]) => {
      acc[menuId] = qty;
      return acc;
    }, {});

  const chartData = {
    labels: Object.keys(sortedMenuIdMap).map((menuId) => {
      const correspondingMenu = reportdetail.find((data) => data.menuId === parseInt(menuId));
      return correspondingMenu ? correspondingMenu.menu.name : `Menu ${menuId}`;
    }),
    datasets: [
      {
        label: 'Best Seller Menu',
        data: Object.values(sortedMenuIdMap), // Menggunakan values dari sortedMenuIdMap
        backgroundColor: colors.slice(0, Object.keys(sortedMenuIdMap).length),
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const lineChart = {
    labels: sortedDays,
    datasets: [
      {
        label: 'Pendapatan Per Hari / (Rp)',
        data: sortedDays.map((day) => transactionsByDay[day] || 0),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  const menuTotalMap = reportdetail.reduce((acc, data) => {
    const { menuId, subTotal } = data;
    acc[menuId] = (acc[menuId] || 0) + parseFloat(subTotal);
    return acc;
  }, {});
  
  const sortedMenuTotalMap = Object.keys(menuTotalMap)
    .sort((a, b) => menuTotalMap[b] - menuTotalMap[a])
    .reduce((acc, menuId) => {
      acc[menuId] = menuTotalMap[menuId];
      return acc;
    }, {});
  
  const totalIncome = Object.values(menuTotalMap).reduce((total, amount) => total + amount, 0);
  // const totalIncomeText = `Total Pendapatan: ${totalIncome.toFixed(2)} (100%)`;

  
  const doughnutChartData = {
    labels: Object.keys(sortedMenuTotalMap).map((menuId) => {
      const correspondingMenu = reportdetail.find((data) => data.menuId === parseInt(menuId));
      const menuName = correspondingMenu ? correspondingMenu.menu.name : `Menu ${menuId}`;
      const percentage = ((sortedMenuTotalMap[menuId] / totalIncome) * 100).toFixed(2);
      return `${menuName} (${percentage}%)`;
    }),
    datasets: [
      {
        data: Object.values(sortedMenuTotalMap),
        backgroundColor: Object.keys(sortedMenuTotalMap).map((_, index) => colors[index % colors.length]),
        borderWidth: 1,
      },
    ],
  };

  return (
    <Layout>
       <h1 className="title">Report</h1>
      <h2 className="subtitle">View of Report</h2>
        <div className='box'><Line data={lineChart}/></div>
        <div className='columns px-2'>
        <div className='box column is-half mr-2'>
             <Bar data={chartData} />
            </div>
        <div className='box column is-half pr-2'>
            <Doughnut data={doughnutChartData}/>
        </div>
        </div>
       
    </Layout>
  )
}

export default Report
