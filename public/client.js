

const socket = io();
let username = "";

// Elements
const usernameModal = document.getElementById("usernameModal");
const usernameInput = document.getElementById("usernameInput");
const joinBtn = document.getElementById("joinBtn");
const chatContainer = document.querySelector(".chat-container");

const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('message');
const messagesDiv = document.getElementById('messages');

// Join Chat
joinBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (name) {
    username = name;
    usernameModal.style.display = 'none';
    chatContainer.classList.remove('hidden');
  } else {
    alert("Name cannot be empty!");
  }
});

// Enter key for joining
usernameInput.addEventListener('keydown', (e) => {
  if (e.key === "Enter") joinBtn.click();
});

// Load old messages
fetch('/messages')
  .then(res => res.json())
  .then(messages => {
    messages.forEach(msg => appendMessage(msg));
  });

// Send message
sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message && username) {
    socket.emit('chatMessage', { username, message });
    messageInput.value = '';
  }
});

// Send message on Enter key
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});

// Receive new messages
socket.on('chatMessage', (data) => {
  appendMessage(data);
});

function appendMessage(data) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

