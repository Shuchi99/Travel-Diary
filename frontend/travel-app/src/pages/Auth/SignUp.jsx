import React, { useState } from 'react'
import PasswordInput from '../../components/input/PasswordInput';
import {useNavigate} from 'react-router-dom'
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';
import { FaEnvelope } from 'react-icons/fa6';
const SignUp = () => {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState(null);
  const navigate = useNavigate();
  const handleSignUp = async(e) =>{
    e.preventDefault();

    if(!name){
      setError("Please enter you Full Name");
      return;
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }

    if(!password){
      setError("Please enter a password");
      return;
    }
    setError("");

    try{
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });
      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch(error){
        if(
          error.response && error.response.data && error.response.data.message){
            setError(error.response.data.message);
          }
          else{
            setError("An unexpected error occured, Please try again.");
          }
    }
  };
  return (
    <div className='h-screen flex items-center justify-center bg-cover bg-center' style={{ backgroundImage: "url('/src/assets/images/bg-signup.jpg')" }}>
      <div className='w-full h-screen flex items-center px-20'>
        <div className='w-1/2 text-white'>
        <div>
            <h4 className="text-5xl text-white font-semibold leading-[58px]">
                Start creating Your <br/> Travel Diary
            </h4>
            <p className="text-[25px] text-white leading-6 pr-7 nt-4">
                Create an account to get started.
            </p>
        </div>
        </div>
        <div className='w-1/2 bg-white p-10 rounded-lg shadow-lg relative overflow-hidden' style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(230,230,230,0.8) 100%)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)" }}>
            <form onSubmit={handleSignUp}>
                <h4 className="text-2xl font-semibold mb-7">Sign Up</h4>

                <input type="text" placeholder="Full Name" className="input-box" value={name}
                onChange={({target}) => {
                  setName(target.value);
                }}></input>

                <div className='relative mb-4'>
                <FaEnvelope className='absolute left-3 top-3 text-gray-400' />
                <input type="text" placeholder="Email" className="input-box pl-10" value={email}
                onChange={({target}) => {
                  setEmail(target.value);
                }}></input></div>
                
                <PasswordInput value={password}
                 onChange={({target}) => {
                  setPassword(target.value);
                }}/>

                {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
                <button type="submit" className="btn-primary">CREATE ACCOUNT</button>
                <p className='text-xs text-slate-500 text-center my-4'>Or</p>
                <button type="submit" className="btn-primary btn-light" onClick={()=>{
                    navigate("/login");
                }}>
                    LOGIN
                </button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp
