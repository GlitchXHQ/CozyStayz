const express = require("express");
const cors = require("cors");
require("dotenv").config();
const database = require("./config/database");
const clerkWebHooks = require("./controllers/clerkWebHooks");

database();

const app = express();

app.use(cors());

// RAW BODY ONLY FOR WEBHOOKS
app.post(
  "/api/clerk/webhooks",
  express.raw({ type: "application/json" }),
  clerkWebHooks
);

// NORMAL JSON FOR ALL OTHER ROUTES
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Server running");
});

module.exports = app;
