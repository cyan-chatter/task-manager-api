const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')


////////////////////////
//public



router.post('/users',async (req, res)=>{
    const user = new User(req.body)
   //  user.save().then(()=>{
   //     res.send(user) 
   //  }).catch((e)=>{
   //      res.status(400).send(e)
   //  })

   const alreadyPresent = await User.findOne({email: req.body.email})
   if(alreadyPresent){
      return res.status(400).send('E-mail already registered')
   }
   try{
      await user.save() 
      sendWelcomeEmail(user.email, user.name)
      const token = await user.generateAuthToken()
      res.status(201).send({user, token})
   }catch(e){
      res.status(400).send(e)
   }

 })

 router.post('/users/login', async (req,res)=>{
   try{    
      const user = await User.findByCredentials(req.body.email, req.body.password)  
      const token = await user.generateAuthToken()
      res.status(200).send({user, token})
    }catch(e){
      const E = e.toString() 
      res.status(400).send(E)
    }
 })



////////////////////////////////////////
//private

router.post('/users/logout', auth, async (req,res)=>{
   try{
      req.user.tokens = req.user.tokens.filter((t)=>{
         return t.token !== req.token
      })
      await req.user.save()
      res.send('You have logged out successfully') 
   }catch(e){
      res.status(500).send()
   }
})


router.post('/users/logoutAll', auth, async(req,res)=>{
   try{
      req.user.tokens = []
      await req.user.save()
      res.send('You have successfully Logged Out from All your Devices')
   }catch(e){
      res.status(500).send()
   }
})



 router.get('/users/me', auth, async (req,res)=>{
    try{
       res.send(req.user)
    }catch(e){
       res.status(500).send(e)
    } 
 
  })
 

 router.patch('/users/me', auth, async (req, res)=>{
   const allowedUpdates = ['name','email','password','age']
   const updates = Object.keys(req.body)
   const isValidOperation = updates.every((update)=>{
      return allowedUpdates.includes(update)
   })

   if(!isValidOperation){
      return res.status(400).send({ error: 'Invalid Updates!'})
   }

   try{
     
      updates.forEach((update)=>{
        req.user[update] = req.body[update]
      }) 

      await req.user.save()       
      res.status(200).send(req.user)
   }

   catch(e){
      return res.status(400).send(e)
   }
   
})

 router.delete('/users/me', auth, async (req, res)=>{
   try{
      sendCancellationEmail(req.user.email, req.user.name)
      await req.user.remove()
      res.send(req.user)
   }catch(e){
      res.status(500).send()
   }
})

////////////////////////////////////
// FILE UPLOADS

const upload = multer({
   //dest: 'avatars',
   limits: {
       fileSize: 1000000
   },
   fileFilter(req,file,cb){
      
      if(!file.originalname.match(/\.(png|jpeg|jpg)$/)){
      return cb(new Error('File must be a an Image'))
    }
      cb(undefined, true)
   }
   
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res)=>{
  
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save() 
  res.send()
}, (error, req, res, next)=>{
   res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req,res)=>{
   req.user.avatar = undefined 
   await req.user.save()
   try{
      res.send()
   }catch(e){
      res.status(400).send(e)
   } 
   
 }) 
 

router.get('/users/me/avatar', auth, async (req,res)=>{
   try{
      
      if(!req.user || !req.user.avatar){
         throw new Error()
      }
      res.set('Content-Type', 'image/png')
      res.send(req.user.avatar)
   } catch(e){
      res.status(404).send()
   }
})

////////////////////////////////////////////

////////////////////////////////////////////
module.exports = router