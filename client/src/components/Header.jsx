// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import DomainIcon from '@mui/icons-material/Domain';
import {Link, useNavigate} from 'react-router-dom'
import {useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
const Header = () => {
  const {currentUser}=useSelector(state=>state.user)
  const [searchTerm,setsearchTerm]=useState('')
  const navigate=useNavigate()
  const handleSUbmit=()=>
  {
    const urlParams=new URLSearchParams(window.location.search)
    urlParams.set('searchTerm',searchTerm)
    const searchQuery=urlParams.toString()
    navigate(`/search?${searchQuery}`)

  }
  useEffect(()=>
  {
    const urlParams=new URLSearchParams(location.search)
    const searchTermFromUrl=urlParams.get('searchTerm')
    if (searchTermFromUrl)
    {
      setsearchTerm(searchTermFromUrl)
    }

  },[location.search])

  return (
    <header className=' bg-gray-50 shadow-md flex justify-between items-center max-w-6xl mx-auto p-3 '>
      <Link to='/'>
     
     
       <div className='flex items-center ml-2  flex-wrap gap-1'>
        
        <DomainIcon className='text-orange-500'/>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap '>
        <span className='text-orange-500'>Chouri</span>
        <span className='text-700'>Buildings</span>
        </h1>
        </div> 
        </Link>
        
          <ul className='flex gap-5'>
            <Link to='/'>
            <li className='hidden sm:inline font-bold text-slate-700 hover:border-b border-orange-500 hover:text-orange-500 '>Home</li>
            </Link>
            <Link to='/about'>
            <li className='hidden sm:inline font-bold text-slate-700 hover:border-b border-orange-500 hover:text-orange-500 '>About</li>
            </Link>
          </ul>
         

        
          {currentUser ? (
            <Link to='/profile'>
            <Avatar alt="Remy Sharp" src={currentUser.avatar} />
            </Link>
            )
          
           :(
            <Link to='/sign-in'>
           <div className=' text-orange-500 p-1 border-2  font-bold'>
           Sign in
    
         </div>
         </Link>
          )}
       
        
     
          

        
     

        
    
    
    </header>
  )
}

export default Header
