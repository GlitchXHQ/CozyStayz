const express = require("express");
const cors = require("cors");
require("dotenv").config();
const clerkWebHooks = require("./controllers/clerkWebHooks");
const database = require("./config/database");

const app = express();
database();
app.use(cors());

// app.post(
//   "/api/clerk/webhook",
//   express.raw({ type: "application/json" }),
//   clerkWebHooks
// );

app.use(express.json());

app.get("/", (req, res) => res.send("Server running"));

module.exports = app;
