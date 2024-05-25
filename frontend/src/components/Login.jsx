import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {LoginUser, reset, getMe} from "../features/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user, isError, isSuccess, isLoading, message} = useSelector((state) => state.auth);

  useEffect(() =>{
    if(user || isSuccess){
      if(user.role == "admin" || user.role == "user"){
        console.log("berikut Usernya " + user.name)
        navigate("/dashboard");
      }
      else{
        console.log("berikut Usernya " + user.name)
        navigate("/");
      }
      
    }
    dispatch(reset());
  },[user, isSuccess, dispatch, navigate]);

  const Auth = (e) =>{
    e.preventDefault();
    // dispatch(LoginUser({email, password}));
    dispatch(LoginUser({ email, password })).then((result) => {
      if (LoginUser.fulfilled.match(result)) {
        // Dispatch getMe immediately after successful login
        dispatch(getMe());
      }
    });
  }
  return (
    <div>
      <section className="hero has-background-grey-light is-fullheight is-fullwidth">
        <div className="hero-body">
          <div className="container">
           <div className="columns is-centered">
            <div className="column is-4">
                <form onSubmit={Auth} className='box'>
                  {isError && <p className='has-text-centered'>{message}</p>}
                <h2 className='title is-2'>Sign In</h2>
                    <div className="field">
                        <label className='label'>Email</label>
                        <div className="control">
                            <input type="text" className='input' value={email} onChange={(e) =>setEmail(e.target.value)} placeholder='Email' />
                        </div>
                    </div>
                    <div className="field">
                        <label className='label'>Password</label>
                        <div className="control">
                            <input type="password" className='input'  value={password} onChange={(e) =>setPassword(e.target.value)} placeholder='******' />
                        </div>
                    </div>
                    <div className="field mt-5">
                        <button type='submit' className="button is-success is-fullwidth">{ isLoading ? 'Loading...' : 'Login'}</button>
                    </div>
                    <div className='is-flex'>
                      <p>Belum Punya Akun? </p>
                      <Link to="/register" className='ml-3'>Daftar Disini</Link>
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

export default Login
