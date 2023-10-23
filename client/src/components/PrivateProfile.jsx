import React from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { Outlet,Navigate } from 'react-router-dom'

const PrivateProfile = () => {
    const {currentUser}=useSelector((state)=>state.user)
  return  currentUser ? <Outlet/>:<Navigate to='/sign-in'/>
   
  

}
export default PrivateProfile
