const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const multer = require('multer')
const {sendWelcomeEmial,sendCancelEmail} = require('../emails/account')

const router = new express.Router()

// Create user reasource request
router.post('/users', async (req,res)=>{ 
    const user = new User(req.body)
   
    try{
          await  user.save()

          sendWelcomeEmial(user.email,user.name)
         const token = await user.generateAuthToken()
        
         res.status(201).send({user,token})
        
    }
    catch(e){
       res.status(400).send(e)
    }    
 
})

router.post('/users/login', async (req,res)=>{
    try{
            const user = await User.findByCredentials(req.body.email,req.body.password) 
            const token = await user.generateAuthToken()

            res.send({user,token})

            // That line use for specid parameter hide and also declare method in router of user
            // res.send({user:user.getPublicProfile(),token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async (req,res)=>{
    try{
            req.user.tokens = req.user.tokens.filter((token)=>{
                    return req.token.token !== req.token
            })
            await req.user.save()
            res.send()
    }catch(e){
        res.status(500  ).send()

    }
})

router.post('/users/logoutall',auth,async (req,res)=>{
        try{
                req.user.tokens = []

             await  req.user.save()
                res.send()
        }catch(e){
                res.status(500).send()
        }
})

// Read all users api resource request
// router.get('/users', auth ,async (req,res)=>{
    
//     try{
//         const users = await User.find({})
//         res.send(users)    
//     }
//     catch(e){
//         res.status(500).send(e)
//     }   
// })

// Read profile
router.get('/users/me',auth,(req,res)=>{
    res.send(req.user)
})



// Read single user using id api resource request
// router.get('/users/:id', async (req,res)=>{
//     const _id = req.params.id

//     try{
//         const user  =await User.findById(_id)
//         if(!user){
//             res.status(404).send()
//         }
//         res.send(user)
//     }
//     catch(e){
//         res.send(500).send()
//     }   
// })

// Update user own profile 
router.patch('/users/me',auth,async (req,res)=>{
        const updates = Object.keys(req.body)
        const allowedUpdates =['name','age','email','password']
        const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
        if(!isValidOperation){
            return res.status(400).send({error:'Invalid Update'})
          
        }
    
    
            
        try{
    
               
    
                updates.forEach((update)=>  req.user[update] = req.body[update])
    
                await req.user.save()
                
                //const user = await User.findByIdAndUpdate(_id,req.body,{new :true,runValidators:true})
              res.send(req.user)
    
        }
        catch(e){
                res.status(400).send(e) 
        }
    
    })


// update single user using id api resource request
// router.patch('/users/:id',async (req,res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdates =['name','age','email','password']
//     const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
//     if(!isValidOperation){
//         return res.status(400).send({error:'Invalid Update'})
      
//     }


//         const _id = req.params.id
//     try{

//             const user = await User.findById(_id)

//             updates.forEach((update)=>  user[update] = req.body[update])

//             await user.save()
            
//             //const user = await User.findByIdAndUpdate(_id,req.body,{new :true,runValidators:true})
//             if(!user){
//                 res.status(404).send()
//             }
           

//             res.send(user)

//     }
//     catch(e){
//             res.status(400).send(e) 
//     }

// })

// delete single user using id api resource request

// router.delete('/users/:id',async (req,res)=>{
//     try{
//             var user =await User.findByIdAndDelete(req.params.id)
//             if(!user){
//                return res.status(404).send()
//             }
//             res.send(user)
//     }catch(e){
//         res.status(500).send(user)
//     }
// })

// delete user own profile using api resource request
router.delete('/users/me',auth,async (req,res)=>{
    try{                      
            await req.user.remove()
            sendCancelEmail(req.user.email,req.user.name)
            res.send(req.user)
    }catch(e){
        res.status(500).send(user)
    }
})


const upload = multer({
   
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
            return cb(new Error('Only jpg,jpeg or png image are allowed to upload '))
        }
        cb(undefined,true)

    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'), async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,Height:250}).png().toBuffer()
      req.user.avatar = buffer
   
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message}) 
})

router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()

})

router.get('/users/:id/avatar',async (req,res)=>{
    try{
       
            const user = await User.findById(req.params.id)
            if(!user || !user.avatar){
                    throw new Error()
            }
            res.set('Content-Type','image/png')
            res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router