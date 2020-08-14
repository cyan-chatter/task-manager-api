 const express = require('express')
 require('./db/mongoose')
 
 const bcrypt = require('bcryptjs')
 const jwt = require('jsonwebtoken')
 const multer = require('multer')

 const userRouter = require('./routers/users')
 const taskRouter = require('./routers/tasks') 
 const adminRouter = require('./routers/admins')
 
 const port = process.env.PORT 
 
 const app = express()

 app.use(express.json())
 app.use(userRouter)
 app.use(taskRouter)
 app.use(adminRouter)

 app.listen(port, ()=>{
     console.log('Local Server is up at port ' + port)
 })

 
 