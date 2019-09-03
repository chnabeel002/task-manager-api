const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    avatar:{
        type : Buffer
    },
    name:{
        type:String,
        required:true,
        trim:true
    
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is Invalid')
            }
        }

    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be positive number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Please password keyword not use in passwprd')

            }
         }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
    
    
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.statics.findByCredentials = async (email,password)=>{
       const user = await User.findOne({email})
    

       if(!user){
           throw new Error('Unable to login')
       }
       const isMatch = await bcrypt.compare(password,user.password)
       if(!isMatch){
             throw new Error('Unable to login')
       }

       return user
}

userSchema.methods.generateAuthToken = async function(){
       const user = this
     
       const token  = jwt.sign({ _id:user._id.toString()},process.env.JWT_SECRET )
       user.tokens = user.tokens.concat({token})

       await user.save()
    
       return token
}

//that method only show profile and hide the password and tokens
userSchema.methods.toJSON = function(){
            const user = this
            const userObject = user.toObject()
    
            delete userObject.password
            delete userObject.tokens
            delete userObject.avatar
                
            return userObject
    } 


// that method is use to hide the specific parameters from response
// userSchema.methods.getPublicProfile = function(){
//         const user = this
//         const userObject = user.toObject()

//         delete userObject.password
//         delete userObject.tokens

//         return userObject
// } 


// Hash the plain text password before saving
userSchema.pre('save', async function(next){
    const user = this
     
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

// Delete the user tasks when user is removed
userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})

    next()

})



//define model
const User = mongoose.model('User',userSchema)

module.exports = User



