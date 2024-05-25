import React, {useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FormAddCategory = () => {
    const [name, setName] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const saveCategory = async (e) =>{
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/category',{
                name: name,
                status : 1
            });
            navigate("/category");
        } catch (error) {
            if(error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
  return (
    <div>
       <h1 className='title'>Category</h1>
      <h2 className='subtitle'>Add New Category</h2>
      <div className="card is-shadowless">
        <div className="card-content">
            <div className="content">
            <form onSubmit={saveCategory}>
                <p className='has-text-centered'>{msg}</p>
                       <div className="field">
                        <label className='label'>Name</label>
                        <div className="control">
                            <input type="text" className='input' value={name} onChange={(e) => setName(e.target.value)} placeholder='Category Name' />
                        </div>
                    </div>
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

export default FormAddCategory
