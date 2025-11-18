const express = require("express");
const cors = require("cors");
require("dotenv").config();
const clerkWebHooks = require("./controllers/clerkWebHooks");
const database = require("./config/database");
const { clerkMiddleware } = require("@clerk/express");

database();

const app = express();

// RAW body BEFORE anything else ❗
app.use("/api/clerk/webhooks", express.raw({ type: "*/*" }));

// Webhook route
app.use("/api/clerk/webhooks", clerkWebHooks);

// Normal JSON
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Server running");
});

module.exports = app;   // ❗ DO NOT USE app.listen()
