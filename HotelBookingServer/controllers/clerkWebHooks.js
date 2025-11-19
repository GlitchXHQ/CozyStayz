const User = require("../models/User");
const { Webhook } = require("svix");

const clerkWebhooks = async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    const svix = new Webhook(WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // IMPORTANT: req.body must be RAW here
    const payload = req.body;

    const event = svix.verify(payload, headers);
    const { data, type } = event;

    // MATCHES YOUR SCHEMA 100%
    const userData = {
      _id: data.id,  // Clerk ID as Mongo _id
      username: `${data.first_name || ""}` + " " +  `${data.last_name || ""}`.trim(),
      email: data.email_addresses?.[0]?.email_address || "",
      image: data.image_url || "",
      role: "user",
      recentSearchedCities: []
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData, { new: true });
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;

      default:
        break;
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processed",
    });

  } catch (err) {
    console.error("WEBHOOK ERROR:", err.message);
    return res.status(400).json({
      success: false,
      message: "Webhook failed",
      error: err.message,
    });
  }
};

module.exports = clerkWebhooks;
