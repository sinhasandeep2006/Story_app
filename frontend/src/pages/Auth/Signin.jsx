
import React, { useState } from 'react'
import PasswordInput from '../../components/input/PasswordInput'
import { useNavigate } from 'react-router-dom'
import{ validateEmail }from '../../utils/helper'
import axiosInstance from '../../utils/axioslnstance'
function Signin() {
  const [Name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const handleSignup = async (e) => {
    e.preventDefault();
    if(!validateEmail(email)){
      setError("Please enter a valid email address.")
      return;
    }
    if(!Name){
      setError("Please enter the Name.")
      return;
    }
    if(!password){
      setError("Please enter the password")
    }
    setError("")

    // signup api call
    try{
      const response =await axiosInstance.post("/create-account",{
        fullName:Name,
        email:email,
        password:password,
      })
      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard")
      }
    }catch(error){
      console.error("Login error:", error)
      if (error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }else{
        setError("An unexpected error occurred. Please try again ")
      }
  }
  }

  return (
    <div className='h-screen bg-cyan-50 overflow-hidden relative'>
      <div className="login-ui-box right-10 -top-40" />
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2" />
      <div className="container h-screen flex flex-col sm:flex-row items-center justify-center px-6 sm:px-20 mx-auto">
        <div className="w-full sm:w-2/4 h-[60vh] sm:h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded p-6 sm:p-10 z-50">
          <div>
            <h4 className="text-3xl sm:text-5xl text-white font-semibold leading-[38px] sm:leading-[58px]">
              Join the  <br /> Adventure
            </h4>
            <p className="text-sm sm:text-[15px] text-gray-700 sm:text-gray-50 leading-5 sm:leading-6 pr-5 sm:pr-7 mt-2 sm:mt-4">
              Create an account to start documenting ypur travels and preseving your memeories in ypur personal travel journal
            </p>
          </div>
        </div>
        <div className="w-full sm:w-2/4 h-[50vh] sm:h-[75vh] bg-white rounded-lg sm:rounded-r-lg relative p-8 sm:p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleSignup}>
            <h4 className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-7">SignUp</h4>
              <input
              type="text"
              placeholder='Name'
              className="input-box"
              value={Name}
              onChange={({ target }) => { setName(target.value) }} />
              <input
              type="text"
              placeholder='Email'
              className="input-box"
              value={email}
              onChange={({ target }) => { setEmail(target.value) }} />
            <PasswordInput
              value={password}
              onChange={({ target }) => { setPassword(target.value) }} />

              {error && <p className="text-red-500 text-xs pb-1" >{error}</p>}
            <button type="submit" className="btn-primary">CREATE ACCOUNT</button>
            <p className="text-xs text-slate-500 text-center my-4">Or</p>
            <button
              type="button"
              className="btn-primary btn-light"
              onClick={() => { navigate("/login") }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signin
