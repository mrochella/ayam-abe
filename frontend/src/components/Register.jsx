import React, {useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [role, setRole] = useState("client");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const saveUser = async(e) =>{
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/users', {
                name : name,
                email: email,
                password: password,
                confPassword : confPassword,
                role: role
            });

           

            Swal.fire("Selamat", 'Akunmu telah Berhasil dibuat', 'success');
            navigate("/");
        } catch (error) {
            if(error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
  return (
    <div>
        <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4">
                        <form onSubmit={saveUser} className='box'>
                <p className='has-text-centered'>{msg}</p>
                <h2 className='title is-2'>Register</h2>
                       <div className="field">
                        <label className='label'>Name</label>
                        <div className="control">
                            <input type="text" className='input' value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
                        </div>
                    </div>
                    <div className="field">
                        <label className='label'>Email</label>
                        <div className="control">
                            <input type="text" className='input' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
                        </div>
                    </div>
                    <div className="field">
                        <label className='label'>Password</label>
                        <div className="control">
                            <input type="password" className='input' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='******' />
                        </div>
                    </div>
                    <div className="field">
                        <label className='label'>Confirm Password</label>
                        <div className="control">
                            <input type="password" className='input' value={confPassword} onChange={(e) => setConfPassword(e.target.value)} placeholder='******' />
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                        <button type='submit' className="button is-success">Register</button>
                        </div>
                    </div>
                </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Register
