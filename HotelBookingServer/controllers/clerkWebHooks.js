const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { Webhook } = require("svix");

router.post("/", async (req, res) => {
  try {
    const wh = new Webhook(process.env.WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const payload = req.body.toString("utf8");
    const evt = wh.verify(payload, headers);

    const { data, type } = JSON.parse(payload);

    const userData = {
      _id: data.id,
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      email: data.email_addresses?.[0]?.email_address || "",
      image: data.image_url || "",
    };

    if (type === "user.created") {
      await User.create(userData);
    } else if (type === "user.updated") {
      await User.findOneAndUpdate({ _id: data.id }, userData);
    } else if (type === "user.deleted") {
      await User.findOneAndDelete({ _id: data.id });
    }
    console.log("🔥 Webhook route HIT");
    console.log("Headers:", req.headers);
    console.log("Raw Body:", req.body)
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
