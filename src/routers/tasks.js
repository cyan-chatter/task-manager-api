const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')
const lodash = require('lodash')

router.post('/tasks', auth, async (req, res)=>{
    
    //const user = new Task(req.body)

    const task = new Task({
       ...req.body,
       owner: req.user._id
    })
    
    try{
       await task.save()
       res.status(201).send(task)
    }catch(e){
      res.status(400).send(e)
    }
            
})

 
// router.get('/tasks', auth, async (req,res)=>{
//    try{
//       // await req.user.populate('tasks').execPopulate()
//       // res.send(req.user.tasks)

//       const tasks = await Task.find({owner: req.user._id})
//       if(!tasks){
//          return res.status(200).send('You don\'t have any task')
//       }
//       res.send(tasks)
//    }catch(e){
//       res.status(500).send()
//    }
   
// })

router.get('/tasks', auth, async (req,res)=>{
   const match = {}
   const sort = {}
     if(req.query.completed){
      if(req.query.completed === 'true'){
         match.completed = true
      } else if(req.query.completed === 'false'){
         match.completed = false
      } else{
         res.status(400).send()
      } 
       
     }

   if(req.query.sortBy){
      const parts = req.query.sortBy.split(':')
      sort[parts[0]] = (parts[1] === 'desc' ? -1 : 1) 
   }

   try{
       await req.user.populate({
          path: 'tasks',
          match,
          options: {
             limit: parseInt(req.query.limit),
             skip: parseInt(req.query.skip),
             sort
          }
       }).execPopulate()

      if(lodash.isEmpty(req.user.tasks)){
         return res.status(400).send('You don\'t have any task')
      }
      res.send(req.user.tasks)
   }catch(e){
      res.status(500).send()
   }
   
})





router.get('/tasks/:id',auth, async(req,res)=>{
   const _id = req.params.id
   try{
      const task = await Task.findOne({ _id, owner: req.user._id})
      if(!task){
         return res.status(404).send('Task Not Found')
      }
      res.send(task) 
   }catch(e){
      res.status(500).send()
   }
  
})



router.patch('/tasks/:id', auth, async (req, res)=>{
   const allowedUpdates = ['description', 'completed']
   const updates = Object.keys(req.body)
   const isValidOperation = updates.every((update)=>{
      return allowedUpdates.includes(update)
   })

   if(!isValidOperation){
      return res.status(400).send({ error: 'Invalid Updates!'})
   }

   try{
      const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
      
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


router.delete('/tasks/:id', auth, async (req, res)=>{
   try{
      const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
      if(!task){
         return res.status(404).send('Task Not Found')
      }
      res.send(task)
   }catch(e){
      res.status(500).send()
   }
})


module.exports = router