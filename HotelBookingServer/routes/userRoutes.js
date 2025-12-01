const express=require('express')
const protect = require('../middleware/authMiddleware')
const {getUserData,storeRecentSearchedCities}=require('../controllers/userController')
const userRouter=express.Router()

userRouter.get('/',protect,getUserData)
userRouter.post('/store-recent-search',protect,storeRecentSearchedCities)

module.exports=userRouter
