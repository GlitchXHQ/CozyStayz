    const mongoose=require('mongoose')
    require('dotenv').config()


    const database=async ()=>{
        try{
        await mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Database Connected Successfully")
        })
        }catch(err){
        console.log("Error While Connecting With Database")
        }
    }

    module.exports=database