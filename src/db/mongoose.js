//C:/Users/DELL/mongo-4/mongodb/bin/mongod.exe --dbpath=C:/Users/DELL/mongo-4/mongodb-data
//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

const mongoose = require('mongoose')
//const validator = require('validator')

User = require('../models/user')
Task = require('../models/task')
Admin = require('../models/admin')


mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})



// const me = new User({
//     name: 'Nickel',
//     age: 22,
//     email: 'thud7@gmail.com',
//     password: '      shoutermango7   '
// })

// me.save().then(()=>{
// console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })




// const work = new Task({
//     description: '  Play PES 2020  ',
//     completed: true,

// })

// work.save().then(()=>{
// console.log(work)
// }).catch((error)=>{
//     console.log(error)
// })



