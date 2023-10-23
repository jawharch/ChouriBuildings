
const User = require("../models/user.model")

const Listing = require("../models/listing.model.Js")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const errorHandler = require("../utils/error")

exports.updateUser=async(req,res,next)=>
{
    // if(req.user.id!==req.params.id) return next(errorHandler(401,'You can only update ur own account'))
   try {
    if(req.body.password)
    {
         req.body.password=bcrypt.hashSync(req.body.password,10)
     
    }
    const updatedUser= await User.findByIdAndUpdate(req.params.id,
        {
            $set:
            {
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
             
            }
        },{new:true})
        const  {password,...rest}=updatedUser._doc
        res.status(200).json(rest)
   } catch (error) {
    next(error)
    
   }
}
exports.deleteUser=async(req,res,next)=>
{
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        
        res.status(200).json("User deleted")

    } catch (error) {
        next(error)
        
    }

}
exports.logout=(req,res,next)=>
{
    try {
        
        res.clearCookie('access_token')
        
        res.status(200).json("You logout")

    } catch (error) {
        next(error)
        
    }

}
exports.getUserListings=async(req,res,next)=>
{
    
    try {
        const listings= await Listing.find({userRef:req.params.id})
        if( !listings)  return  next(errorHandler(404, 'this user has no listings'));
         res.status(200).json(listings)


        
    } catch (error) {
        next(error)
        
    }
}
exports.getUser = async (req, res, next) => {
    try {
      
      const user = await User.findById(req.params.id);
    
      if (!user) return next(errorHandler(404, 'User not found!'));
    
      const { password, ...rest } = user._doc;
    
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };