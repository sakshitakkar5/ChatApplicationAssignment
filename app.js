const express = require("express");
const { client, connectDB } = require("./db");

const app = express();
app.use(express.json());

const DB_NAME = "myDatabase";
const COLLECTION_NAME = "messages";

// Connect to MongoDB first
connectDB().then(() => {
  // POST API to store a message
  app.post("/message", async (req, res) => {
    const { username, message } = req.body;
    try {
      const database = client.db(DB_NAME);
      const collection = database.collection(COLLECTION_NAME);

      const result = await collection.insertOne({
        username,
        message,
        createdAt: new Date()
      });

      res.status(201).json({ success: true, id: result.insertedId });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET API to fetch messages
  app.get("/messages", async (req, res) => {
    try {
      const database = client.db(DB_NAME);
      const collection = database.collection(COLLECTION_NAME);

      const messages = await collection.find().toArray();
      res.json(messages);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Start server after DB connection
  app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
});
node 