// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { loginInFailure, loginInStart, loginInSuccess } from '../redux/user/userSlice'


const SignUp = () => {
  const dispatch=useDispatch()
  const {loading,error}=useSelector(state=>state.user)

  const handleGoogleClick=async()=>
  {
    try {
      const provider=new GoogleAuthProvider()
      const auth=getAuth(app)
      const result=await signInWithPopup(auth,provider)
      console.log(result.user.photoURL)

      const  res=await axios.post('http://localhost:3000/api/auth/google',{name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
      console.log(res.data)
      dispatch(loginInSuccess(res.data))
      navigate('/')
    } catch (error) {

      console.log(error)
      
    }
  }
  const navigate=useNavigate()
  const toast=useToast()
  const [formdata,setdata]=useState({})

  const handlechange=(e)=>
  {
    setdata({
      ...formdata,
      [e.target.name]:e.target.value
    })
  }
  const handleSubmit=async(e)=>
  {
    e.preventDefault()
  
    try {
      dispatch(loginInStart())
      const res = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      },{ withCredentials: true });
      const data = await res.json();
      console.log(data)
     
      if (data.success === false) {
        dispatch(loginInFailure(data.message))
       
        setdata({
          username: '',
          email: '',
          password: ''
        });
       
        
       
        return;
      }
      dispatch(loginInSuccess(data))
      
   

      toast({
        title: `Welcome  `,
        status: 'success',
        position:'bottom-left',
        isClosable: true,
      })
      navigate('/')
      
      
    } catch (error) {
      
      dispatch(loginInFailure(error.message))
    }
  }
  return (
    <form  onSubmit={handleSubmit}className='bg-gray-50  min-h-screen flex items-center justify-center' >
      <div className='max-w-4xl rounded-2xl bg-gray-100 flex'>
      <div className='sm:w-1/2 px-16 py-16 '>
        <h2 className='font-bold text-2xl'>

          Login
        </h2>
        
        <div className='flex flex-col gap-4'>
          <input onChange={handlechange} className='p-2 mt-8 rounded-xl border' type='text' name='email' placeholder='Email'/>
          <input  onChange={handlechange} className='p-2  rounded-xl border' type='password' name='password' placeholder='Password'/>
          <button disabled={loading} type='submit' className='bg-orange-400 rounded-xl text-white py-2'>
            {loading ? 'Loading...':'Login'}
          </button>
          {error && <p>  <span className='text-red-400 font-bold mr-10 text-sm'>{error}</span> try again</p>}
        </div>
        <div className='mt-10 grid grid-cols-3 items-center text-gray-500'>
          <hr  className='border-gray-500'/>
          <p className='text-center text-sm'>OR</p>
          <hr className='border-gray-500' />

        </div>
        <button onClick={handleGoogleClick} type='button' className='bg-white border py-3 w-full rounded-xl mt-5 flex items-center justify-center'>
        <svg  className='mr-3'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="25px" height="25px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
          Login with Google</button>
          <p className='mt-10 text-xs border-b py-4'>Forgot your Password ?</p>
        <div className='text-sm flex justify-between items-center mt-3'>
          <p>Dont have an account ? </p>
          
          <Link to='/sign-in'>
          
          <button className='py-2 px-5 bg-orange-400 border rounded-xl'>Register</button>
           
          </Link>
        </div>
     

      </div>
      <div className='sm:block hidden w-1/2  '>
        <img className=' rounded-2xl ' src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGl2aW5nJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" alt="img" />
      </div>
      
      </div>
      
    </form>
  )
}

export default SignUp
