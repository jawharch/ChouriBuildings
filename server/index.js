const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
const cookieparser=require('cookie-parser')

const userRouter=require('./routes/user.route')
const authRouter=require('./routes/auth.route')
const listingRouter=require('./routes/listing.route')
dotenv.config()
mongoose.connect(process.env.MONGO).then(()=>console.log('connected')).catch((err)=>console.log(err))
const app=express()
app.use(express.urlencoded({
    extended:true
}))
const corsOptions ={
    origin:'*', 
    credentials:true,            
    optionSuccessStatus:200
}
app.use(cors(corsOptions));


app.use(express.json())
app.use(cookieparser())

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/listing',listingRouter)
app.use((err,req,res,next)=>
{
    const statusCode=err.statusCode||500;
    const message=err.message|| 'internal Server Error'
    return res.status(statusCode).json(
        {
            success:false,
            statusCode,
            message
        }
    )

})
app.listen(3000,()=>
{
    console.log('Server is running on port 3000')
})
