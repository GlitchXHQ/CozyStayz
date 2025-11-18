const express = require("express");
const cors = require("cors");
require("dotenv").config();

const clerkWebHooks = require("./controllers/clerkWebHooks");
const database = require("./config/database");
const { clerkMiddleware } = require("@clerk/express");

database();
const app = express();

app.use(cors());

// 1️⃣ RAW BODY FOR WEBHOOKS — IMPORTANT
app.post(
  "/api/clerk/webhooks",
  express.raw({ type: "*/*" }), 
  clerkWebHooks
);

// 2️⃣ NORMAL JSON for other routes
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Server Started Successfully");
});

module.exports = app;
