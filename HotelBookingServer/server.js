const express = require("express");
const cors = require("cors");
require("dotenv").config();
const clerkWebHooks = require("./controllers/clerkWebHooks");
const database = require("./config/database");
const { clerkMiddleware } = require("@clerk/express");

database();

const app = express();
app.use(cors());

// 1️⃣ RAW BODY FOR WEBHOOKS (must use */* because Clerk sends application/clerk+json)
app.use(
  "/api/clerk/webhooks",
  express.raw({ type: "*/*" })
);

// 2️⃣ WEBHOOK ROUTE
app.use("/api/clerk/webhooks", clerkWebHooks);

// 3️⃣ NORMAL JSON PARSER FOR OTHER ROUTES
app.use(express.json());

// 4️⃣ CLERK MIDDLEWARE
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Server Started Successfully");
});

module.exports = app;
  