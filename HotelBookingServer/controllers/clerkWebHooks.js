const User=require('../models/User')
const {WebHook}=require('svix')

const clerkWebhooks=async (req,res)=>{
  try{
    const whook=new WebHook(process.env.WEBHOOK_SECRET)
    if(!whook)
      return res.status(404).json({message:"SECRET KEY MISSING",success:false})

    const headers={
      "svix-id":req.headers['svix-id'],
      "svix-timestamp":req.headers['svix-timestamp'],
      "svix-signature":req.headers['svix-signature'],
    }

    await whook.verify(JSON.stringify(req.body),headers)

    const {data,type}=req.body

    const userData={
      _id:data._id,
      username:data.first_name + " " + data.last_name,
      email:data.email_addresses[0].email_address,
      images:data.image_url,
    }

    switch(type){
      case "user.created":
        await User.create(userData)
      case "user.deleted":
        await User.findByIdAndDelete({_id:data.id})
      case "user.updated":
        await User.findByIdAndUpdate({_id:data.id,userData})
      default:
        break
    }

    res.json({success:true,message:"Webhook Received"})
  }catch(Err){
    res.json({success:false,message:"Webhook Not Received"})
  }
}

module.exports=clerkWebhooks