const express = require("express");
const cors = require("cors");
require("dotenv").config();
const database = require("./config/database");
const {clerkMiddleware}=require('@clerk/express');
const clerkWebhooks = require("./controllers/clerkWebHooks");
const userRouter = require("./routes/userRoutes");
const hotelRouter = require("./routes/hotelRoutes");
const connectCloudinary = require("./config/cloudinary");
const roomRouter = require("./routes/roomRoutes");
const bookingRouter = require("./routes/bookingRoutes");
database()
connectCloudinary()
const app = express();
app.use(cors())

app.post('/api/clerk',
 express.raw({ type: "application/json" })  
,clerkWebhooks)

app.use(express.json())
app.use(clerkMiddleware())


app.get("/", (req, res) => {
  res.send("Server running");
});

app.use('/api/user',userRouter)
app.use('/api/hotels',hotelRouter)
app.use('/api/rooms',roomRouter)
app.use('/api/bookings',bookingRouter)
  
app.listen(process.env.PORT,()=>{
  console.log(`Server Is Running at PORT: ${process.env.PORT}`) 
})

// module.exports=app