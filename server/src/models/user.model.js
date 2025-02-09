//add bcrypt and jwt and related fn here 
//aggregate paginate in model where it is req
import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema=new Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshToken:{
        type:String,
        // if we write string in array then user can log in from multiple device 
    },
    role:{
        type:String,
        enum: ['user', 'admin'], // Define roles
        default: 'user'
    },
    bookingHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Booking"
    }]
    
},{ timestamps: true })
//hashes the pass
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))  return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})
// compares simp pass with hasspass
userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=function (){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            userName:this.userName,
            fullName:this.fullName,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function (){
    return jwt.sign(
        {
            _id:this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User=mongoose.model("User",userSchema)