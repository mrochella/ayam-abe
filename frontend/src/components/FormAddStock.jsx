import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Calendar } from "react-date-range";
import format from "date-fns/format";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../css/Calendar.css";

const FormAddStock = () => {
  const [namaItem, setNamaItem] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [qty, setQty] = useState();
  const [tipeOpname, setTipeOpname] = useState("");
  const [productId, setProductId] = useState("");
  const [msg, setMsg] = useState("");
  const [calendar, setCalendar] = useState("");
  const [open, setOpen] = useState(false);
  const refOne = useRef(null);
  const [deliveryOption, setDeliveryOption] = useState("pemasukan");
  const [itemlist, setItemList] = useState([]);
  const [itemlistfix, setItemListFix] = useState({});
  const navigate = useNavigate();
  


  const handleOptionChange = (option) => {
    setDeliveryOption(option);
    console.log("Selected delivery option:", option);
  };

  useEffect(() => {
    // set current date
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products");
        setItemList(response.data);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    setCalendar(format(new Date(), "MM/dd/yyyy"));
    fetchData();
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  // hide dropdown on ESC press
  const hideOnEscape = (e) => {
    console.log(e.key);
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // hide on Outside Click
  const hideOnClickOutside = (e) => {
    // console.log(refOne.current)
    // console.log(e.target)
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  // on data change , store date in state
  const handleSelect = (date) => {
    // console.log(date)
    // console.log(format(date, 'MM/dd/yyyy'))
    setCalendar(format(date, "MM/dd/yyyy"));
  };



  const saveStock = async(e) =>{
    e.preventDefault();
    const { uuid, name, id, price } = itemlistfix;

    // Mengonversi nilai qty ke integer
  const parsedQty = parseInt(qty, 10);

  // Mengonversi nilai price ke integer
  const parsedPrice = parseInt(price, 10);
    let pricee;
    if(deliveryOption === "pemasukan"){
      pricee = parsedPrice + parsedQty;
    }
    else{
      pricee = parsedPrice - parsedQty;
    }
  
    try {
        // await axios.patch(`http://localhost:5000/products/${uuid}`, {
        //   // apakah bisa jika update tidak memerlukan nama
        //     price : pricee,
        // });

        await axios.post("http://localhost:5000/stockopname", {
          namaItem : name,
          tanggal : calendar,
          qty : qty,
          tipeOpname : deliveryOption,
          productId : id
        })
        navigate("/stockopname");
    } catch (error) {
        if(error.response) {
            setMsg(error.response.data.msg);
        }
    }
}

  return (
    <div>
      <h1 className="title">Stock</h1>
      <h2 className="subtitle">Add New Opname</h2>
      <div>
        <div className="is-flex is-flex-direction-column ">
          <input
            value={calendar}
            readOnly
            className="inputBox mx-6"
            onClick={() => setOpen((open) => !open)}
          />

          <div ref={refOne}>
            {open && (
              <Calendar
                date={new Date()}
                onChange={handleSelect}
                className='calendarElement"'
              />
            )}
          </div>
        </div>
      </div>
      <div className="card is-shadowless mt-4">
        <div className="card-content">
          <div className="content">
            <form onSubmit={saveStock}>
              <p className="has-text-centered">{msg}</p>
              <div className="control mb-5">
            <div className="select is-fullwidth">
              <select
                value={itemlistfix.uuid || ""}
                onChange={(e) => {
                  const selectedOption = itemlist.find(item => item.uuid === e.target.value);
                  setItemListFix(selectedOption || {});
                }}
              >
                <option value="">Select Item</option>
                {itemlist.map((item) => (
                  <option key={item.id} value={item.uuid}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
              <div className="field">
                <label className="label">Qty</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    placeholder="Jumlah Item"
                  />
                </div>
              </div>
              <div className="is-flex is-justify-content-center columns ml-6 mt-3">
                <div className="column is-3">
                  <input
                    type="radio"
                    id="dineIn"
                    name="deliveryOption"
                    className="is-hidden"
                    checked={deliveryOption === "pemasukan"}
                    onChange={() => handleOptionChange("pemasukan")}
                  />
                  <label
                    htmlFor="dineIn"
                    className="button"
                    style={{
                      width: "180px",
                      background:
                        deliveryOption === "pemasukan" ? "orange" : "white",
                      color: deliveryOption === "pemasukan" ? "white" : "orange",
                      border:
                        deliveryOption === "dineIn"
                          ? "none"
                          : "1px solid orange",
                    }}
                  >
                    Pemasukan
                  </label>
                </div>
                <div className="column is-3">
                  <input
                    type="radio"
                    id="pengeluaran"
                    name="deliveryOption"
                    className="is-hidden"
                    checked={deliveryOption === "pengeluaran"}
                    onChange={() => handleOptionChange("pengeluaran")}
                  />
                  <label
                    htmlFor="pengeluaran"
                    className="button"
                    style={{
                      width: "180px",
                      background:
                        deliveryOption === "pengeluaran" ? "dodgerblue" : "white",
                      color:
                        deliveryOption === "pengeluaran" ? "white" : "dodgerblue",
                      border:
                        deliveryOption === "pengeluaran"
                          ? "none"
                          : "1px solid dodgerblue",
                    }}
                  >
                    Pengeluaran
                  </label>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit"  style={{
                      width: "180px"
                    }} className="button is-success has-text-weight-semibold">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddStock;
