import React, { useState, useEffect } from "react";
import axios from "axios";
import LayoutPos from "./LayoutPos";
import { useSelector, useDispatch } from "react-redux";
import { getDetails } from "../features/posSlice";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";


const formatRupiah = (value) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  });
}

const BayarOrder = () => {
  // const storedTransaction = localStorage.getItem("reduxState")?.transaction || {};
  // console.log(storedTransaction);
  const { pesanan, total, uuidTransaction, totalSebelumReset} = useSelector(
    (state) => state.transaction
  );
  const [uangDiterima, setUangDiterima] = useState("");
  const [uangKembali, setUangKembali] = useState(0);
  const [totalUang, setTotalUang] = useState(0);
  const [msg, setMsg] = useState("");
  // const {pesanan, total, uuidTransaction} =  storedTransaction;


  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("halo " + uuidTransaction);
    const fetchData = async () => {
      try {
        await dispatch(getDetails({ id: uuidTransaction }));

        // Lakukan hal-hal lain setelah mendapatkan detail
        // getCarts();
      } catch (error) {
        console.error("Error fetching details:", error.message);
        // Handle error jika diperlukan
      }
    };

    if (uuidTransaction) {
      fetchData();
    }
  }, [uuidTransaction, dispatch]);

  useEffect(() => {
    // Menghitung uang kembali setiap kali nilai uangDiterima atau total berubah
    // const parsedTotal = parseFloat(total.replace(/[^0-9.-]+/g, ""));
    if(uangDiterima == ""){
      setUangKembali(0);
    }
    if(totalSebelumReset != 0 || uangDiterima != ""){
      const totalSebelumResetString = totalSebelumReset.toString();
      const parsedTotal = parseFloat(totalSebelumResetString.replace(/[^0-9.-]+/g, ""));
      const parsedUangDiterima = parseFloat(uangDiterima.replace(/[^0-9.-]+/g, ""));
      const uangKembaliResult = parsedUangDiterima - totalUang;
      console.log("totalnyaa" + parsedTotal);
      console.log("masukkkk" + uangKembaliResult)
      console.log("masukkya " + parsedUangDiterima)
      
      // Update state uangKembali
      setUangKembali(isNaN(uangKembaliResult) ? 0 : uangKembaliResult);
      // setUangDiterima(parsedUangDiterima);
      if (totalSebelumReset !== 0) {
        setTotalUang(parsedTotal);
      }
    }
  
  }, [uangDiterima, total]);

  const simpanTransaksi = async () => {
    const parsedUangDiterima = parseFloat(uangDiterima.replace(/[^0-9.-]+/g, ""));
    if ( parsedUangDiterima > totalUang) {
      try {
        const statusPembayaran = "Complete";
        const tokenPembayaran = "bayarditempat";
        const tipePembayaran = "Cash";
        if(pesanan == ""){
          pesanan = "dineIn"
        }
        const tipePesanan = pesanan;
        const userType = "cashier";
        const receivedAmount = uangDiterima;
        const changeAmount = uangKembali;
        const total = totalUang;
        await axios.patch(
          `http://localhost:5000/transactions/${uuidTransaction}`,
          {
            statusPembayaran,
            tipePesanan,
            total,
            tokenPembayaran,
            tipePembayaran,
            userType,
            receivedAmount,
            changeAmount,
          }
        );
        Swal.fire("Congrats", 'Your Transaction has been saved', 'success');
        navigate("/orders");
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    }else{
      Swal.fire("Perhatian", 'Maaf Uang anda kurang', 'warning');
    }
  };
  return (
    <LayoutPos uuidTransaction={uuidTransaction}>
      <div className="box mt-4 mr-4" style={{ height: "80vh" }}>
        <p className="title has-text-centered">Rp. {totalUang} </p>
        <div>
          <div
            style={{
              background: "gray",
              paddingBottom: "1px",
              marginTop: "10px",
              marginLeft: "10px",
            }}
          ></div>
        </div>
        <div className="mt-6">
          <p className="subtitle has-text-weight-medium ml-3">
            Uang yang diterima
          </p>
          <div className="box box-shadow">
            <input
              type="text"
              placeholder="Masukkan jumlah uang"
              value={uangDiterima}
              onChange={(e) => setUangDiterima(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-6">
          <p className="subtitle has-text-weight-medium ml-3">Uang Kembali</p>
          <div className="box box-shadow">{uangKembali}</div>
        </div>
        <div className="mt-6">
          <div className="columns is-multiline ml-6">
            <div className="column is-one-quarter">
              <Link to="/orders/add" className="button is-primary is-danger" >Kembali</Link>
            </div>
            <div className="column is-one-quarter"></div>
            <div className="column is-one-quarter"></div>
            <div className="column is-one-quarter">
              <button
                className="button is-primary"
                onClick={() => simpanTransaksi()}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutPos>
  );
};

export default BayarOrder;
