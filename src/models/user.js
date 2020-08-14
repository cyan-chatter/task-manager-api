const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age:{
        type: Number,
        validate(value){
             if(value<0){throw new Error('Age must be a positve number')}
         }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('E-mail is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.length<6){
                throw new Error('Password must have atleast 6 characters')
            }
            if(value.toLowerCase().includes('password')){
                throw new Error('Password must not contain the Word : password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
}) 

userSchema.virtual('tasks',{
     ref: 'Task',
     localField: '_id',
     foreignField: 'owner'
})



userSchema.statics.findByCredentials = async (email, password) =>{
    const user = await User.findOne({ email })
    
    if(!user){
        throw new Error('E-mail not registered')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch){
        throw new Error('Incorrect Password')
    }

    return user
}

userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token 
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}


//hash the password before saving
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()

})

userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})


const User = mongoose.model('User',userSchema)

module.exports = User