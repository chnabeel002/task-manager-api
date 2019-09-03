const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task') 

const app = express()
const port = process.env.PORT


// Image upload demo using multer npm library
const multer = require('multer')
const upload = multer({
    dest:'images',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a Word Document'))
        }

        cb (undefined,true)
        // cb(new Error('FIle must be a PDF'))
        // cb(undefined,true)
        // cb(undefined,false)
    }
})

app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()

},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

// app.use((req,res, next)=>{
//     if(req.method==='GET'){
//       res.send('GET requests are disabled')
//     }
//     else{       
//         next()
//     }   
// })

// app.use((req,res,next)=>{
//     res.status(504).send('Site is in mantianance mode')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

//
// Without middleware: new request -> run route handler
//
// With middleware:    new request -> do something  -> run route handler
//

app.listen(port,()=>{
    console.log('Server is up on port ' + port )
})

// JsonWebToken demo
// const jwt = require('jsonwebtoken')

// const myFunction = async ()=>{
//     const token = jwt.sign({_id:'abc123'},'thisismynewcourse',{expiresIn:'7 days'})
//     console.log(token)

//     const data = jwt.verify(token,'thisismynewcourse')
//     console.log(data)
// }

// myFunction() 



// Hash password demo 

const bcrypt = require('bcryptjs')

// const myFunction = async ()=>{ 
//      const password = 'Red12345!'
//      const hashedPassword = await bcrypt.hash(password,8)

//      console.log(password)
//      console.log(hashedPassword)


//     const isMatch = await bcrypt.compare('Red12345!',hashedPassword)
//     console.log(isMatch)

// }


// myFunction()

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async ()=>{
//     //  const task = await Task.findById('5d67afef1a6a8a170ccaf19d')
//     //  await task.populate('owner').execPopulate()
//     //  console.log(task.owner)

//     const user = await  User.findById('5d67ac70ff27ca3ea0057aac')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
     
// }
// main()


