import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const FormEditMenu = () => {
    const[title, setTitle] = useState("");
    const[price, setPrice] = useState("");
    const[category, setCategory] = useState([]);
    const[categoryfix, setCategoryfix] = useState();
    const[file, setFile] = useState("");
    const[preview, setPreview] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const {id} = useParams();

    const getMenuById = async() =>{
        const response = await axios.get(`http://localhost:5000/menu/${id}`);
        setTitle(response.data.name);
        setFile(response.data.image);
        setPrice(response.data.price);
        setCategoryfix(response.data.categoryId);
        setPreview(response.data.url);
    }
    
    useEffect(() => {
        
        const fetchData = async() =>{
            try {
                const response = await axios.get("http://localhost:5000/category")
                    setCategory(response.data)
                
            } catch (error) {
                if(error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        }
       fetchData();
       getMenuById();
    },[])

   

    const loadImage = (e) =>{
        const image = e.target.files[0];
        setFile(image);
        setPreview(URL.createObjectURL(image));
    }

    const updateMenu = async (e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("price", price);
        formData.append("category", categoryfix);
        try {
            await axios.patch(`http://localhost:5000/menu/${id}`, formData, {
                headers:{
                    "Content-type": "multipart/form-data"
                }
            });
            navigate("/menu");
        } catch (error) {
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }
  return (
    <div>
      <h1 className='title'>Menu</h1>
      <h2 className='subtitle'>Update Menu</h2>
      <div className="card is-shadowless">
        <div className="card-content">
            <div className="content">
            <form onSubmit={updateMenu} >
            <p className='has-text-centered'>{msg}</p>
                <div className="field">
                    <label className="label">Menu Name</label>
                    <div className="control">
                        <input type="text" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Menu Name' />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Menu Price</label>
                    <div className="control">
                        <input type="text" className="input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder='Menu Price' />
                    </div>
                </div>
                <div className="field">
                        <label className='label'>Category</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select value= {categoryfix} onChange={(e)=> setCategoryfix(e.target.value)}>
                                    {category.map((cat) =>(
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>


                <div className="field">
                    <label className="label">Image</label>
                    <div className="control">
                        <div className="file">
                            <label className="file-label">
                                <input type="file" className='file-input' onChange={loadImage} />
                                <span className='file-cta'>
                                    <span className='file-label'>Choose a file...</span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
                
                {preview ? (
                    <figure className='image is-128x128'>
                        <img src={preview} alt='Preview Image'/>
                    </figure>
                ):(
                    ""
                )}

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

export default FormEditMenu
