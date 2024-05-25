import React,  {useEffect, useState} from 'react'
import NavbarClient from "../components/NavbarClient";
import "../css/HomePage.css";
import terkini1 from "../asset/banner1.png"
import terkini2 from "../asset/banner2.jpg"
import terkini3 from "../asset/ayam3.jpg"
import terkini4 from "../asset/ayam4.jpg"
import terkini5 from "../asset/ayam5.jpg"
import terkini6 from "../asset/ayam6.jpg"
import { getCarts } from '../features/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const HomePage = () => {
  const [active, setActive] = useState(0);
  // const {user, isError, isSuccess, isLoading, message} = useSelector((state) => state.auth);
  const items = [terkini1, terkini2, terkini3, terkini4, terkini5, terkini6];
  // const [uuidcart, setUuidCart] = useState("");
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // Pemanggilan cekCart saat komponen pertama kali dimuat
  //     await cekCart();
      
  //     // Pemanggilan getCarts jika user sudah login dan memiliki keranjang
  //     if (user) {
  //       await dispatch(getCarts({ id: uuidcart }));
  //     }
      
  //     // Menjumlahkan qty dari setiap item di cartDetail
  //   };

  //   fetchData();
  // }, [user]);

  // const cekCart = async() =>{
  //   if(user){
  //     const existingCart = await axios.get("http://localhost:5000/cart", {
  //     validateStatus: (status) => status < 500, // Resolve only if the status code is less than 500
  //   });
  
  //   if (existingCart.status === 200 && existingCart.data && Object.keys(existingCart.data).length > 0) {
  //     setUuidCart(existingCart.data.uuid);
  //     // Jika user sudah memiliki cart, langsung navigasi ke halaman car
  //     console.log("masuk1");
  //   } else {
  //     console.log("haloo eee");
  //     // Jika user belum memiliki cart, tambahkan cart baru
  //     const response = await axios.post("http://localhost:5000/cart", {
  //       tipePesanan: "dineIn",
  //       total: "0",
  //       userType: "buyer",
  //     });
  
  //   }
  //   }
    
  // }



  useEffect(() => {
    const intervalId = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [items]);

  const prevClickHandler = () => {
    setActive((prev) => (prev - 1 + items.length) % items.length);
  };

  const nextClickHandler = () => {
    setActive((prev) => (prev + 1) % items.length);
  };

 
  return (
    <div>
      <NavbarClient />
      <section className="hero">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">ABE Restaurant</h1>
          {/* <h2 className="subtitle"></h2> */}
        </div>
        <div className="slider mt-5">
        <div className="list" style={{ left: `-${active * 100}%` }}>
              {items.map((item, index) => (
                <div className={`item`} key={index}>
                  <img src={item} alt={`Slide ${index + 1}`} />
                </div>
              ))}
            </div>

      <div className="buttonss">
        <button onClick={prevClickHandler}>{'<'}</button>
        <button onClick={nextClickHandler}>{'>'}</button>
      </div>

      <ul className="dots">
        {items.map((_, index) => (
          <li key={index} className={index === active ? 'active' : ''}></li>
        ))}
      </ul>
    </div>
      </div>

      
    </section>
    </div>
  );
};

export default HomePage;
