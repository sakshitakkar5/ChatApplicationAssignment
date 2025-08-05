const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// ==============================
// Step 1: Setup Express + Socket.IO
// ==============================
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(cors());
app.use(express.json());

// ==============================
// Step 2: Connect to MongoDB Atlas (No deprecated options)
// ==============================
// Replace <username>, <password>, and <dbname> with your actual MongoDB Atlas credentials
mongoose.connect(
    'mongodb+srv://sakshitakkar5:RHrw5uG7NG3yD5s8@cluster0.aepcrni.mongodb.net/chatapp?retryWrites=true&w=majority'
)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ==============================
// Step 3: Create Message Schema
// ==============================
const messageSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// ==============================
// Step 4: Serve Frontend
// ==============================
app.use(express.static(path.join(__dirname, 'public')));

// API to fetch past messages
app.get('/messages', async (req, res) => {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
});

// ==============================
// Step 5: Socket.IO Events
// ==============================
io.on('connection', (socket) => {
    console.log('🟢 New user connected');

    socket.on('chatMessage', async (data) => {
        // Save to DB
        const newMessage = new Message({ username: data.username, message: data.message });
        await newMessage.save();

        // Broadcast to all users
        io.emit('chatMessage', newMessage);
    });

    


});

// ==============================
// Step 6: Start Server (Change Port to Avoid EADDRINUSE)
// ==============================
const PORT = process.env.PORT || 5000; // changed to 5000
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
