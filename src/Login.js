import React from 'react'
import { useRef, useState, useEffect, useContext } from 'react';
import './login.css';
import AuthContext from './context/AuthProvider';
import axios from './api/axios';


const LOGIN_URL = '/auth';

const Login = () => {
    const {setAuth} = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(()=>{
        userRef.current.focus();
    },[]);

    useEffect(()=>{
        setErrMsg('');
    }, [user, pwd]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        try{
            const response = await axios.post(LOGIN_URL, JSON.stringify({user, pwd}), {
                headers: { 'Content-Type': 'application/json'},
                withCredentials: true,
            });
            console.log(JSON.stringify(response?.data))
            console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken });
            setUser('');
            setPwd('');
            setSuccess(true);
        }catch(err){
            if(!err?.response){
                setErrMsg('no server response')
            } else if(err.response?.status === 400){
                setErrMsg('missing username or password')
            } else if (err.response.status === 401){
                setErrMsg('unauthorized')
            } else {
                setErrMsg('failed')
            }
                errRef.current.focus();
        }

        
    }

  return (

    <>

    {success? (
        <section>
            <h1>You Are Logged In !</h1>
            <br />
            <p>
                <a href='#'>Go To Home</a>
            </p>
        </section>
    ) : (
    
    <section className='sign-in-section'>
        <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>
            {errMsg}
        </p>
        <h1 className='sign-in-title'>Sign In</h1>
        <form onSubmit={handleSubmit} className='sign-in-form'>
            <label htmlFor='username'>UserName</label>
            <input 
            type='text' 
            id='username' 
            ref={userRef}
            autoComplete='off'
            onChange={(e)=> setUser(e.target.value)}
            value={user}
            required
            />
            <label htmlFor='password'>Password</label>
            <input 
            type='password' 
            id='password' 
            autoComplete='off'
            onChange={(e)=> setPwd(e.target.value)}
            value={pwd}
            required
            />
            <button>Sign In</button>
        </form>
        <p>
            Need an Account? <br />
            <span className='line'>
                {/* {put react router link here to relevant page} */}
                <a href='#'>Sign Up</a>
            </span>
        </p>
    </section> )}
    
    </>
  )
}

export default Login;