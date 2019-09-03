const mongoose = require('mongoose')


// define connectionUrl with databasename
const connectionUrl = process.env.MONGODB_URL

//connect with database 
mongoose.connect(connectionUrl,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false  
   
})

 
// const Task = mongoose.model("Task",{
//     description:{ 
//          type:String,
//          required:true,
//          trim:true
//     },
//     completed:{
//         type:Boolean,
//         default:false
//     }
// })

// const task = new Task({
//     description:"Just for check the description       ",
    

// })

// task.save().then(()=>{
//     console.log(task)
// }).catch((error)=>{
//     console.log("Error!",error);
// })