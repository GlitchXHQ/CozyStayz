const express = require("express");
const cors = require("cors");
require("dotenv").config();
const clerkWebHooks = require("./controllers/clerkWebHooks");
const database = require("./config/database");
const { clerkMiddleware } = require("@clerk/express");

database();

const app = express();
app.use(cors());

// 1️⃣ RAW BODY ONLY FOR WEBHOOKS
app.use(
  "/api/clerk/webhooks",
  express.raw({ type: "application/json" })
);

// 2️⃣ WEBHOOK ROUTE (uses raw body)
app.use("/api/clerk/webhooks", clerkWebHooks);

// 3️⃣ NORMAL JSON BODY FOR OTHER ROUTES
app.use(express.json());

// 4️⃣ CLERK MIDDLEWARE FOR PROTECTED ROUTES
app.use(clerkMiddleware());

// 5️⃣ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server Started Successfully");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Click Here: http://localhost:${PORT}`);
});
