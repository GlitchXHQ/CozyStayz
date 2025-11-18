const express = require("express");
const cors = require("cors");
require("dotenv").config();
const clerkWebHooks = require("./controllers/clerkWebhooks");
const database = require("./config/database");
const { clerkMiddleware } = require("@clerk/express");

database();

const app = express();

app.use(cors());

// 🔥 RAW BODY ONLY FOR WEBHOOK (must come BEFORE express.json)
app.post(
  "/api/clerk/webhooks",
  express.raw({ type: "application/json" }),
  clerkWebHooks
);

// 🔥 ALL OTHER ROUTES USE NORMAL JSON
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Server running");
});

module.exports = app;
