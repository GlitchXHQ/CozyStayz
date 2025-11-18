const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node"); 
const clerkWebHooks = require("./controllers/clerkWebHooks");
const database = require("./config/database");

const app = express();
app.use(cors());

// Normal JSON parsing for all NON-WEBHOOK routes
app.use(express.json());

// Clerk auth middleware for all protected backend routes
app.use(ClerkExpressWithAuth());

// ************* IMPORTANT *************
// Webhooks MUST use RAW BODY
app.post(
  "/api/clerk/webhook",
  express.raw({ type: "application/json" }),
  clerkWebHooks
);
// *************************************

database();

app.get("/", (req, res) => {
  res.send("Server Started Successfully");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Click Here: http://localhost:${PORT}`);
})