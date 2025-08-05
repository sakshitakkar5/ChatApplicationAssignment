const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://sakshitakkar5:K3MX75pdodh2CVxP@cluster0.aepcrni.mongodb.net/chatapp";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
    return client;
  } catch (err) {
    console.error("❌ MongoDB Connection Failed", err);
    process.exit(1);
  }
}

module.exports = { client, connectDB };
