const express = require("express");
const cors = require("cors");
require("dotenv").config();

const clerkWebHooks = require("./controllers/clerkWebHooks");
const database = require("./config/database");
const { clerkMiddleware } = require("@clerk/express");

database();

const app = express();

app.use(cors());

// 1️⃣ RAW BODY FOR WEBHOOKS (must be FIRST)
app.use(
  "/api/clerk/webhooks",
  express.raw({ type: "application/json" })
);

// 2️⃣ WEBHOOK ROUTE (only POST)
app.post("/api/clerk/webhooks", clerkWebHooks);

// 3️⃣ NORMAL JSON BODY PARSER
app.use(express.json());

// 4️⃣ CLERK MIDDLEWARE (after webhook)
app.use(clerkMiddleware());

// 5️⃣ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server Started Successfully");
});

// Export for Vercel
module.exports = app;
