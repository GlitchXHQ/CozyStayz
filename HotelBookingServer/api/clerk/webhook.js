export const config = {
  api: {
    bodyParser: false,  
  },
};

const { Webhook } = require("svix")
require("dotenv").config()
const database = require("../../config/database")
const User = require("../../models/User")

database();

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST requests allowed");
  }

  try {
    const payload = await new Promise((resolve) => {
      let data = [];
      req.on("data", (chunk) => data.push(chunk));
      req.on("end", () => resolve(Buffer.concat(data)));
    });

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const evt = wh.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = evt;

    const userData = {
      _id: data.id,
      username: `${data.first_name || ""} ${data.last_name || ""}`,
      email: data.email_addresses?.[0]?.email_address || "",
      image: data.image_url || "",
    };

    if (type === "user.created") await User.create(userData);
    if (type === "user.updated") await User.findOneAndUpdate({ _id: data.id }, userData);
    if (type === "user.deleted") await User.findOneAndDelete({ _id: data.id });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log("WEBHOOK ERROR:", err.message);
    return res.status(400).json({ error: err.message });
  }
};
