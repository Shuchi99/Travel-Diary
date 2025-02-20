import React, { useState } from 'react'
import PasswordInput from '../../components/input/PasswordInput';
import {useNavigate} from 'react-router-dom'
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';
import { FaEnvelope } from 'react-icons/fa6';
import bgSignup from "../../assets/images/bg-signup.jpg";

const loginStyle = {
  backgroundImage: `url(${bgSignup})`,
};
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
    <div className='h-screen flex items-center justify-center bg-cover bg-center px-5 lg:px-20' style={loginStyle}>
      <div className='w-full lg:w-1/2 text-white text-center lg:text-left mb-6 lg:mb-0'>
        <h2 className='text-4xl lg:text-5xl font-bold mb-4'>Start Creating Your Travel Diary</h2>
        <p className='text-lg font-semibold'>Create an account to get started.</p>
      </div>
      <div className='w-full max-w-md lg:w-1/2 bg-white p-6 lg:p-10 rounded-lg shadow-lg relative overflow-hidden' style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(230,230,230,0.9) 100%)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)" }}>
        <h2 className='text-2xl font-semibold text-center mb-6 text-gray-700 relative z-10'>Sign Up</h2>
        <form onSubmit={handleSignUp} className='relative z-10'>
          <input type='text' placeholder='Full Name' className='input-box w-full mb-4' value={name} onChange={({ target }) => setName(target.value)} />
          <div className='relative mb-4'>
            <FaEnvelope className='absolute left-3 top-3 text-gray-400' />
            <input type='text' placeholder='Email Address' className='input-box pl-10 w-full' value={email} onChange={({ target }) => setEmail(target.value)} />
          </div>
          <PasswordInput value={password} onChange={({ target }) => setPassword(target.value)} />
          {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
          <button type='submit' className='btn-primary w-full cursor-pointer'>CREATE ACCOUNT</button>
          <p className='text-xs text-slate-500 text-center my-4'>Or</p>
          <button type='button' className='btn-primary btn-light w-full cursor-pointer' onClick={() => navigate('/login')}>
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
