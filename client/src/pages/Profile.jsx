// eslint-disable-next-line no-unused-vars
import React, { useRef, useState } from 'react'
import Header from '../components/Header'

import { Avatar } from '@mui/material'
import { useDispatch,useSelector } from 'react-redux'

import { deleteStart, deleteWithFailure, deleteWithSuccess, loginInStart, logoutStart, logoutWithFailure, logoutWithSuccess, updateStart, updateWithFailure, updateWithSuccess } from '../redux/user/userSlice'
import { useToast } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
  const {currentUser,loading}=useSelector((state)=>state.user)
  const toast = useToast()
  const fileRef=useRef(null)
  const [formdata,setformdata]=useState({})
  const [Listings,setLsitings]=useState([])
  const [showListingsError,setshowListingsError]=useState(false)
  const dispatch=useDispatch()

  const handlechange=(e)=>
  {
    setformdata({
      ...formdata,
      [e.target.id]:e.target.value
    })
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      console.log(loading)
      const res = await fetch(`http://localhost:3000/api/user/update/${currentUser._id}`, {
        method: 'POST',
       
        
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      // console.log(data)
      if (data.success === false) {
        dispatch(updateWithFailure(data.message));
        return;
      }

      dispatch(updateWithSuccess(data));
      toast({
        title: `user updated `,
        status: 'success',
        position:'top-left',
        isClosable: true,
      })
      
   
    } catch (error) {
      dispatch(updateWithFailure(error.message));
    }
  };
  const handledelete=async()=>
  {
    try {
      dispatch(deleteStart());
      console.log(loading)
      const res = await fetch(`http://localhost:3000/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
       
        
    })
      const data = await res.json();
      console.log(data)
      if (data.success === false) {
        dispatch(deleteWithFailure(data.message));
        return;
      }

      
          dispatch(deleteWithSuccess(null));
      
      toast({
        title: `${data} `,
        status: 'success',
        position:'top-left',
        isClosable: true,
      })
   
    } catch (error) {
      dispatch(deleteWithFailure(error.message));
    }

  }
  const handlelogout=async()=>
  {
    try {
      dispatch(logoutStart());
      console.log(loading)
      const res = await fetch(`http://localhost:3000/api/user/logout`, {
        method: 'DELETE',
       
        
    })
      const data = await res.json();
      console.log(data)
      if (data.success === false) {
        dispatch(logoutWithFailure(data.message));
        return;
      }

      
        dispatch(logoutWithSuccess());
      
      toast({
        title: `${data} `,
        status: 'success',
        position:'top-left',
        isClosable: true,
      })
   
    } catch (error) {
      dispatch(logoutWithFailure(error.message));
    }

  }
  const handleShowListings=async()=>
  {
    try {
      setshowListingsError(false)
      const res=await axios.get(`http://localhost:3000/api/user/listings/${currentUser._id}`)
      console.log(res.data)
      
      if(res.data.success===false)
      {
        setshowListingsError(true)
        return
      }
      setLsitings(res.data)

      
    } catch (error) {
      setshowListingsError(true)

      
    }

  }
  const handleListingDelete = async (listingId) => {
    try {
      const res=await axios.delete(`http://localhost:3000/api/listing/delete/${listingId}`)
      console.log(res.data)
      if(res.data.success===false)
      {
        console.log(res.data.message)
        return
      }
      setLsitings((prev)=>
      prev.filter(item=> item._id!==listingId))
      toast({
        title: `${res.data} `,
        status: 'success',
        position:'top-left',
        isClosable: true,
      })


      
    } catch (error) {
      console.log(error.message)
      
    }
   

     
    
  };


  return (
    <div>
      <Header/>
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 justify-center items-center' >
          <input type='file' ref={fileRef}  hidden accept='image/*'/>
        <Avatar
        className=' object-cover cursor-pointer self-center mt-2'
        onClick={()=>fileRef.current.click()}
        
  alt="Remy Sharp"
  src={currentUser.avatar}
  sx={{ width: 150, height: 150 }}
  
/>
<input onChange={handlechange}  defaultValue={currentUser.username}type='text' placeholder='Username' id='username' className='border p-3 rounded-lg'/>
<input  onChange={handlechange}  defaultValue={currentUser.email}  type='text' placeholder='Email' id='email' className='border p-3 rounded-lg'/>
<input  onChange={handlechange}  defaultValue={currentUser.password} type='password' placeholder='Password' id='password' className='border p-3 rounded-lg'/>

<button type='submit'  disabled={loading} className='bg-slate-700  text-white rounded-lg hover:opacity-95 uppercase p-3 '>{ loading  ? 'Loading...':'Update'}</button>
<Link to='/create-listing'>
<button type='submit'  className='bg-green-700  text-white rounded-lg hover:opacity-95 uppercase p-3 '>create a listing</button></Link>
<div className='flex justify-between mt-5  items-center'>
  <span onClick={handledelete} className='text-red-700 cursor-pointer mr-4'>Delete Account</span>
  <span  onClick={handlelogout} className='text-red-700 cursor-pointer ml-4'>Sign out</span>
</div>
<button type='button' onClick={handleShowListings} className='text-green-700 w-full'>Show Listings </button>
{!showListingsError ?

  <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
{
  Listings && Listings.length>0 &&
  Listings.map((item,i)=>
  (
    <div key={i}  className='border rounded-lg p-3 flex justify-between items-center gap-4'>
      <Link to={`/listing/${item._id}`}>
        <img src={item.imageUrls[0]} alt='lsiting cover' className='h-16 w-16 object-contain'/>
      
      </Link>
      <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${item._id}`}
              >
                <p>{item.name}</p>
              </Link>
              <div className='flex flex-col item-center'>
                <button type='button'
                  onClick={() => handleListingDelete(item._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${item._id}`}>
                  <button type='button' className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>


    </div>

  )
  )
}
</div>

:<p className='font-bold text-red-700'>no Listings available</p> }

</form>

      </div>
    </div>
  )
}

export default Profile
