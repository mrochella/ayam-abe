import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const FormEditProduct = () => {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() =>{
        const getProductById = async() =>{
            try {
                const response = await axios.get(`http://localhost:5000/products/${id}`);
                setName(response.data.name);
                setPrice(response.data.price);
            } catch (error) {
                if(error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        }
        getProductById();
          // Memanggil procedure dengan data yang sesuai
    //   updateProduct(id, name, price, 'admin');
    },[id])

    // const updateProduct = async(e) =>{
    //     e.preventDefault();
    //     try {
    //         await axios.patch(`http://localhost:5000/products/${id}`, {
    //             name : name,
    //             price : price,
    //         });
    //         navigate("/products");
    //     } catch (error) {
    //         if(error.response) {
    //             setMsg(error.response.data.msg);
    //         }
    //     }
    // }

    // versi sql procedure

    const updateProduct = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.patch('http://localhost:5000/updateInventory', {
            productId : id,
            name : name,
            price : price,
            requesting_user_role : "admin",
          });
      
          
          console.log(response.data.msg);  // Menampilkan pesan dari server
          navigate("/products");
        } catch (error) {
          console.error(error);
        }
      };
      
    
      

  return (
    <div>
        <h1 className='title'>Item</h1>
      <h2 className='subtitle'>Edit Item</h2>
      <div className="card is-shadowless">
        <div className="card-content">
            <div className="content">
            <form onSubmit={updateProduct}>
                <p className='has-text-centered'>{msg}</p>
                       <div className="field">
                        <label className='label'>Name</label>
                        <div className="control">
                            <input type="text" className='input' value={name} onChange={(e) => setName(e.target.value)}  placeholder='Product Name' />
                        </div>
                    </div>
                    <div className="field">
                        <label className='label'>Price</label>
                        <div className="control">
                            <input type="text" className='input' value={price} onChange={(e) => setPrice(e.target.value)} placeholder='Price' />
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                        <button type='submit' className="button is-success">Update</button>
                        </div>
                    </div>
                </form>
            </div>
            </div>
        </div>
    </div>
  )
}

export default FormEditProduct
