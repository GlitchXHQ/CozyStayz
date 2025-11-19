const express = require("express");
const cors = require("cors");
require("dotenv").config();
const database = require("./config/database");
const {clerkMiddleware}=require('@clerk/express');
const clerkWebhooks = require("./controllers/clerkWebHooks");
database()

const app = express();
app.use(cors())

app.use(express.json())
app.use(clerkMiddleware())

app.use('/api/clerk',clerkWebhooks)

app.get("/", (req, res) => {
  res.send("Server running");
});


// app.listen(process.env.PORT,()=>{
//   console.log("Server Is Running") 
// })

module.exports=app