const Hotel=require('../models/Hotel')
const User=require('../models/User')

const HotelRegister=async(req,res)=>{
    try{
        const {name,address,contact,city}=req.body
        const owner=req.user._id

        const hotel=await Hotel.findOne({owner})
        if(hotel)
        {
            res.status(402).json({
                success:false,
                message:"Already Registered"
            })
        }

        await Hotel.create({name,address,contact,city,owner})

        await User.findByIdAndUpdate(owner,{role:"hotelOwner"})

        return res.status(200).json({
            success:true,
            message:"Hotel Registered Successfully"
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

module.exports={HotelRegister}