const User = require("../models/User");
const { Webhook } = require("svix");

const clerkWebHooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const evt = wh.verify(req.body, headers); // req.body is RAW
    const { data, type } = evt;

    const userData = {
      _id: data.id,
      username: `${data.first_name || ""} ${data.last_name || ""}`,
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

    res.status(200).send({ success: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(400).send({ error: err.message });
  }
};

module.exports = clerkWebHooks;
