const app = require('./app')
const port = process.env.PORT 
 
app.listen(port, ()=>{
     console.log('Local Server is up at port ' + port)
 })

 
 