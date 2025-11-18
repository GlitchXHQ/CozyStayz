const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {clerkMiddleware} = require('@clerk/express')
// const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node"); 
const clerkWebHooks = require("./controllers/clerkWebHooks");
const database = require("./config/database");
const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/clerk/",clerkWebHooks);
database();
app.get("/", (req, res) => {
  res.send("Server Started Successfully");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Click Here: http://localhost:${PORT}`);
})