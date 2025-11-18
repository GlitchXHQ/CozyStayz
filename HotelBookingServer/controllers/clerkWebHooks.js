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

    // Verify signature using RAW BODY BUFFER
    //const rawBody = req.body; // Buffer
    const evt= await wh.verify(req.body,headers);

    // Convert to JSON
    // const bodyString = rawBody.toString("utf8");
    const { data, type } = evt

    const userData = {
      _id: data.id,
      username: data.first_name + " " + data.last_name + "" ,
      email: data.email_addresses?.[0]?.email_address || "",
      image: data.image_url || "",
    };

    switch (type) {
      case "user.created":{
        await User.create(userData);
        break;
      }

      case "user.updated":{
        await User.findOneAndUpdate({_id:data.id}, userData);
        break;
      }
      case "user.deleted":{
        await User.findOneAndDelete({_id:data.id});
        break;
        }
      default:
        break;  
    }

    res.json({ success: true, message: "Webhook received" });

  } catch (err) {
    console.log("Clerk Webhook Error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = clerkWebHooks;
