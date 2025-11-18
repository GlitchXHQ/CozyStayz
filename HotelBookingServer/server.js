const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {clerkMiddleware} = require('@clerk/express')
const clerkWebHooks = require("./controllers/clerkWebHooks");
const database = require("./config/database");
const app = express();
app.use(cors());
database();
app.use(
  "/api/clerk/webhook",
  express.raw({ type: "application/json" })
);
app.use(express.json());
app.use(clerkMiddleware());

app.post("/api/clerk/webhook", clerkWebHooks);

app.get("/", (req, res) => {
  res.send("Server Started Successfully");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Click Here: http://localhost:${PORT}`);
})
