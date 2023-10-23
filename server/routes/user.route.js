const express=require('express')
const  {updateUser, deleteUser,getUserListings,getUser}  = require('../controllers/user.controller')
const {  verifyToken } = require('../utils/verifyUser')
const router=express.Router()

router.post('/update/:id',updateUser)
router.delete('/delete/:id',deleteUser)
router.delete('/logout',deleteUser)
router.get('/listings/:id',getUserListings)
router.get('/:id',getUser)
module.exports=router