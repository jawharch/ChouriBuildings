const mongoose=require('mongoose')
const userSchema=new mongoose.Schema(
    {
        username:
        {
            type:String,required:true,unique:true
        },
        password:
        {
            type:String,required:true,
        },
        email:
        {
            type:String,required:true,unique:true
        },
        avatar:
        {
            type:String,
            default:'https://lh3.googleusercontent.com/a/ACg8ocLne1F1AiJKAJGFpoY5IXHcxLB7usIPcZ7mmOTNW1Rd_LM=s96-c'

        },
    },
    {
        timestamps:true
    }
)
const  User=mongoose.model('User',userSchema)
module.exports=User