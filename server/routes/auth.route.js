const express=require('express')
const {signup,signin,emailCheck, google} = require('../controllers/auth.controller')


const router=express.Router()
router.post('/signup',signup)
router.post('/signin',signin)
router.post('/echeck',emailCheck)
router.post('/google',google)


module.exports=router