const jwt = require('jsonwebtoken')
const express = require('express')
const Admin = require('../models/admin')
// app.use((req,res,next)=>{
//     if(req.method === 'GET' || req.method === 'POST' || req.method === 'PATCH' || req.method === 'DELETE'){
//         res.status(503).end('Request Temporarily Disabled. Server is Under Maintainance')
//     } else{
//        next()
//     }

// })

const authAdmin = async(req, res, next)=>{
    try{ 
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({_id: decoded._id, 'tokens.token':token})
        
        if (!admin) {
        throw new Error()
        }
    req.token = token
    req.admin = admin
    next()

    }catch(e){
        res.status(401).send('error: Please authenticate.')
    }
}

module.exports = authAdmin
