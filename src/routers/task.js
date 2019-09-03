const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// Create task api resource request
router.post('/tasks',auth,async (req,res)=>{
    //var task = new Task(req.body)
    const task  = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
         await task.save()
         res.status(201).send(task)
    }catch(e){
        
         res.status(400).send()
    }
 
 })


 // Read all tasks against user ID
 
 // Filtering
 // Get /tasks?completed=false
 
 // Pagination
 // Get /tasks?limit=10&skip=0

 // Sorting
 // Get /tasks?sortBy=createdAt:asc
 router.get('/tasks',auth, async (req,res)=>{
         // Method 1: to populate the all tasks
        //const tasks = await Task.find({owner:req.user._id})

        // Filtering
        const match ={} 
        // Sorting
        const sort ={}


        if(req.query.completed){
             match.completed = req.query.completed ==='true'
         }

         if(req.query.sortBy){
             const parts = req.query.sortBy.split(':')
             sort[parts[0]]=parts[1]==='desc' ? -1 : 1
         }


        // Method 2: to populate the all tasks
        await  req.user.populate({
            path:'tasks',
            match,
        // options use for pagination and sorting 
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

         try{
            res.send(req.user.tasks) 

            //For method 1
            //res.send(tasks)
         }catch(e){
             res.status(500).send()
     
         }
      })


// Read all tasks api resource request
// router.get('/tasks', async (req,res)=>{
//      const tasks = await Task.find({})
//      try{
//          res.send(tasks)
//      }catch(e){
//          res.status(500).send()
 
//      }
//   })
 
  // user fetch the task aginst their id
  router.get('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id
    try{
    //   const task = await Task.findById(_id)
   const task = await Task.findOne({_id,owner:req.user._id })

      if(!task){
          res.status(404).send()
      }
      res.send(task)
    }
    catch(e){
        res.status(500).send()
    }
   
})



 // read single task using id api resource request
//  router.get('/tasks/:id',async (req,res)=>{
//      const _id = req.params.id
//      try{
//        const task = await Task.findById(_id)
//        if(!task){
//            res.status(404).send()
//        }
//        res.send(task)
//      }
//      catch(e){
//          res.status(500).send()
//      }
    
//  })
 
router.patch('/tasks/:id',auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates= ['description','completed']
   const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
   if(!isValidOperation){
    return res.status(400).send({error:'Invalid Update'})
   } 

    const _id = req.params.id
    try{
                const task = await Task.findOne({_id:req.params.id,owner:req.user._id})      
            //    const task = await Task.findById(_id)

              

            //const task=await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
            if(!task){
                res.status(400).send()
            }

            updates.forEach((update)=> task[update] = req.body[update])

            task.save()
            res.send(task)
    }
    catch(e){
        res.status(400).send(e)

    }

})






 // update single task using id api resource request
//  router.patch('/tasks/:id',async (req,res)=>{
//      const updates = Object.keys(req.body)
//      const allowedUpdates= ['description','completed']
//     const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
//     if(!isValidOperation){
//      return res.status(400).send({error:'Invalid Update'})
//     } 
 
//      const _id = req.params.id
//      try{
//                 const task = await Task.findById(_id)

//                 updates.forEach((update)=> task[update] = req.body[update])

//                 task.save()

//              //const task=await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
//              if(!task){
//                  res.status(400).send()
//              }
//              res.send(task)
//      }
//      catch(e){
//          res.status(400).send(e)
 
//      }
 
//  })
 
//  Delete task using user ID
router.delete('/tasks/:id',auth,async (req,res)=>{
    try{
            var task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
            if(!task){
                res.status(404).send()
            }
            res.send(task)
    }
    catch(e){
        res.status(500).send(task)
    }
})



 // delete single task using id api resource request
//  router.delete('/tasks/:id',async (req,res)=>{
//      try{
//              var task = await Task.findByIdAndDelete(req.params.id)
//              if(!task){
//                  res.status(404).send()
//              }
//              res.send(task)
//      }
//      catch(e){
//          res.status(500).send(task)
//      }
//  })

 module.exports = router
 
