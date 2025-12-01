const express=require('express')
const protect = require('../middleware/authMiddleware')
const { HotelRegister } = require('../controllers/hotelController')
const hotelRouter=express.Router()

hotelRouter.post('/',protect,HotelRegister)

module.exports=hotelRouter