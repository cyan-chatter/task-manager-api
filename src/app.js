const express = require('express')
require('./db/mongoose')


const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks') 
const adminRouter = require('./routers/admins')


const app = express()
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(adminRouter)

module.exports = app

