const Hotel = require("../models/Hotel")
const Room = require("../models/Room")
const cloudinary = require('cloudinary').v2

const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body
    const hotel = await Hotel.findOne({ owner: req.auth.userId })

    if (!hotel) {
      return res.json({ success: false, message: "No Hotel Found" })
    }

    // Upload Images to Cloudinary
    const uploadImages = req.files.map(async (file) => {
      const uploaded = await cloudinary.uploader.upload(file.path)
      return uploaded.secure_url
    })

    const images = await Promise.all(uploadImages)

    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities: JSON.parse(amenities),
      images,
    })

    return res.json({ success: true, message: "Room Created Successfully" })

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error"
    })
  }
}



const getRooms=async(req,res)=>{
    try{
        const room = await Room.find({isAvailable:true}).populate({
            path:'hotel',populate:{
                path:'owner',
                select:'image'
            }
        }).sort({createdAt:-1})

        return res.status(200).json({
            success:true,
            rooms:room
        })
    }catch(err)
    {
        console.log(err)
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}


const getOwnerRooms=async(req,res)=>{
    try{
        const hotelData=await Hotel.findOne({owner:req.auth.userId})
        const room=await Room.find({hotel:hotelData._id.toString()}).populate("hotel")

        return res.status(200).json({
            success:true,
            rooms:room
        })
    }catch(err)
    {
        console.log(err)
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

const toggleRoomAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const roomData = await Room.findById(id);

    if (!roomData) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();

    return res.status(200).json({
      success: true,
      message: "Room Availability Updated",
      isAvailable: roomData.isAvailable
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};




module.exports={createRoom,toggleRoomAvailability,getOwnerRooms,getRooms}