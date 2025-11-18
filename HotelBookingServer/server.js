const express = require("express");
const cors = require("cors");
require("dotenv").config();
const clerkWebHooks = require("./controllers/clerkWebhooks");
const database = require("./config/database");
const { clerkMiddleware } = require("@clerk/express");

database();

const app = express();

// 🔥 RAW body ONLY for webhook route
app.use("/api/clerk/webhooks", express.raw({ type: "application/json" }));

// 🔥 Webhook route
app.use("/api/clerk/webhooks", clerkWebHooks);

// Now enable JSON for rest
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Server running");
});

module.exports = app;
