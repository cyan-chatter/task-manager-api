const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const Admin = require('../models/admin')
const Task = require('../models/task')
const auth = require('../middleware/authAdmin')
const multer = require('multer')
const sharp = require('sharp')
const lodash = require('lodash')
//////////////////////////////////////////////

 /////////////////////////////////////////////////////////

 router.post('/admin/login', async (req,res)=>{
   try{    
      const user = await Admin.findByCredentials(req.body.email, req.body.password)  
      const token = await user.generateAuthToken()
      res.status(201).send({'admin': user, token})
    }catch(e){
      const E = e.toString() 
      res.status(400).send(E)
    }
 })



router.post('/admin/logout', auth, async (req,res)=>{
    try{
       req.admin.tokens = req.admin.tokens.filter((t)=>{
          return t.token !== req.token
       })
       await req.admin.save()
       res.send('You have logged out successfully') 
    }catch(e){
       res.status(500).send()
    }
 })
 


//////////////////////////////////////////////////
// ADMIN - Access on Users

router.get('/admin/users/:id',auth, async (req,res)=>{
    const _id = req.params.id
    try{
      const user = await User.findById(_id)  
      if(!user){
         return res.status(404).send('User Not Found')
      }
      res.send(user)
    }catch(e){
      res.status(500).send(e)
    }
       
 })


 router.get('/admin/users',auth, async (req,res)=>{
    
    try{
      const user = await User.find({})  
      if(!user){
         return res.status(404).send('No User Found')
      }
      res.send(user)
    }catch(e){
      res.status(500).send(e)
    }
       
 })


router.get('/admin/users/:id/avatar', auth, async (req,res)=>{
   try{
      const user = await User.findById(req.params.id)
      if(!user || !user.avatar){
         throw new Error()
      }
      res.set('Content-Type', 'image/png')
      res.send(user.avatar)
   } catch(e){
      res.status(404).send()
   }
})

 router.delete('/admin/users/:id', auth, async (req, res)=>{
    try{
       const user = await User.findById(req.params.id)
       await user.remove()
       if(!user){
          return res.status(404).send('User Not Found')
       }
       res.send(user)
    }catch(e){
       res.status(500).send()
    }
 })


  router.patch('/admin/users/:id', auth, async (req, res)=>{
    const allowedUpdates = ['name','email','password','age']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update)=>{
       return allowedUpdates.includes(update)
    })
 
    if(!isValidOperation){
       return res.status(400).send({ error: 'Invalid Updates!'})
    }
 
    try{
       //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true })
       
       const user = await User.findById(req.params.id)
       
       if(!user){
         return res.status(404).send('No User with Specified ID in the Database') 
      }
      
       updates.forEach((update)=>{
         user[update] = req.body[update]
       }) 

       await user.save()       
       res.status(200).send(user)
    }
 
    catch(e){
       return res.status(400).send(e)
    }
    
 })


//////////////////////////////////////
// ADMIN - Access on Tasks

// Getting All Tasks of a specific User
router.get('/admin/users/:userID/tasks', auth, async (req,res)=>{
   
   try{
   const user = await User.findById(req.params.userID)  
   //const task = await Task.findOne({ _id, owner: user._id})
   const tasks = await Task.find({owner: user._id})
   
      if(lodash.isEmpty(tasks)){
         return res.status(400).send('This User does not have any task')
      }
      res.send(tasks)
   }catch(e){
      res.status(500).send()
   }
   
})

router.get('/admin/users/:userID/tasks/:taskID', auth, async (req,res)=>{
   
   try{
   const user = await User.findById(req.params.userID)
   if(!user){
      throw new Error('User Not Found')
   }  
   const tasks = await Task.findOne({ _id: req.params.taskID, owner: user._id})
   //const tasks = await Task.find({owner: user._id})
   
      if(lodash.isEmpty(tasks)){
         return res.status(400).send('This User does not have this task')
      }
      res.send(tasks)
   }catch(e){
      res.status(500).send()
   }
   
})

router.patch('/admin/users/:userID/tasks/:taskID', auth, async (req, res)=>{
   const allowedUpdates = ['description', 'completed']
   const updates = Object.keys(req.body)
   const isValidOperation = updates.every((update)=>{
      return allowedUpdates.includes(update)
   })

   if(!isValidOperation){
      return res.status(400).send({ error: 'Invalid Updates!'})
   }

   try{
      const user = await User.findById(req.params.userID)
      if(!user){
         throw new Error('User Not Found')
      }
      const task = await Task.findOne({_id: req.params.taskID, owner: user._id})
      
      if(!task){
         return res.status(404).send('Task Not Found') 
      }
      
      updates.forEach((update)=>{
         task[update] = req.body[update]
      })
      await task.save()
      res.status(200).send(task)
   }

   catch(e){
      return res.status(400).send(e)
   }
   
})

router.delete('/admin/users/:userID/tasks/:taskID', auth, async (req, res)=>{
   try{
      const user = await User.findById(req.params.userID)
      if(!user){
         throw new Error('User Not Found')
      }
  
      const task = await Task.findOneAndDelete({_id: req.params.taskID, owner: user._id})
      if(!task){
         return res.status(404).send('Task Not Found')
      }
      res.send(task)
   }catch(e){
      res.status(500).send()
   }
})







//////////////////////////////////////

module.exports = router