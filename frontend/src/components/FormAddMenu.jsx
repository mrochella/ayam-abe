import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FormAddMenu = () => {
    const[title, setTitle] = useState("");
    const[price, setPrice] = useState("");
    const[category, setCategory] = useState([]);
    const[categoryfix, setCategoryfix] = useState();
    const[file, setFile] = useState("");
    const[preview, setPreview] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (category.length > 0) {
            setCategoryfix(category[0].id);
          }
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
    },[])

    const loadImage = (e) =>{
        const image = e.target.files[0];
        setFile(image);
        setPreview(URL.createObjectURL(image));
    }
    const saveMenu = async (e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("price", price);
        formData.append("category", categoryfix);
        try {
            await axios.post("http://localhost:5000/menu", formData, {
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
      <h2 className='subtitle'>Add New Menu</h2>
      <div className="card is-shadowless">
        <div className="card-content">
            <div className="content">
            <form onSubmit={saveMenu} >
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
                        <button type='submit' className="button is-success">Save</button>
                    </div>
                </div>
            </form>
            </div>
           
        </div>
      </div>
    </div>
  )
}

export default FormAddMenu
