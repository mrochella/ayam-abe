import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const FormEditCategory = () => {
    const [name, setName] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() =>{
        const getCategoryById = async() =>{
            try {
                const response = await axios.get(`http://localhost:5000/category/${id}`);
                setName(response.data.name);
            } catch (error) {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        }
        getCategoryById();
    },[id])

    // const updateCategory = async (e) =>{
    //     e.preventDefault();
    //     try {
    //         await axios.patch(`http://localhost:5000/category/${id}`,{
    //             name: name,
    //             status: 1
    //         });
    //         navigate("/category");
    //     } catch (error) {
    //         if(error.response){
    //             setMsg(error.response.data.msg);
    //         }
    //     }
    // }

    // versi sql nya
    const updateCategory = async (e) => {
        e.preventDefault();
        try {
            // Assuming `id` is the category_id and `newName` is the new_category_name
            await axios.patch(`http://localhost:5000/updateCategorysql`, {
                category_id: id,  // Assuming id is the category_id
                new_category_name: name,  // Assuming name is the new_category_name
            });
            navigate("/category");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };
  return (
    <div>
      <h1 className='title'>Category</h1>
      <h2 className='subtitle'>Add New Category</h2>
      <div className="card is-shadowless">
        <div className="card-content">
            <div className="content">
            <form onSubmit={updateCategory}>
                <p className='has-text-centered'>{msg}</p>
                       <div className="field">
                        <label className='label'>Name</label>
                        <div className="control">
                            <input type="text" className='input' value={name} onChange={(e) => setName(e.target.value)} placeholder='Category Name' />
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

export default FormEditCategory
