const mineflayer = require('mineflayer');
const fs = require('fs');
const path = require('path');

// Bot configuration
const bot = mineflayer.createBot({
  host: '8b8t.me', // Change to your server IP if needed
  port: 25565,       // Default Minecraft port
  username: '0xPwnd_ONTOP', // Bot username
  version: '1.21.1'    // Minecraft version (adjust as needed)
});

// File path for messages
const sayFilePath = path.join(__dirname, 'coord.txt');

// Bot event handlers
bot.on('login', () => {
  console.log('Bot logged in successfully!');
  
  // Execute login commands after a short delay
  setTimeout(() => {
    bot.chat('/login govinda');
    console.log('Sent login command');
  }, 1000);
  
  setTimeout(() => {
    bot.chat('/8b8t');
    console.log('Sent 8b8t command');
  }, 2000);
});

bot.on('spawn', () => {
  console.log('Bot spawned in the world!');
  startMessageLoop();
});

bot.on('chat', (username, message) => {
  console.log(`<${username}> ${message}`);
});

bot.on('error', (err) => {
  console.error('Bot error:', err);
});

bot.on('end', () => {
  console.log('Bot disconnected');
});

// Variables for message cycling
let messageIndex = 0;
let messages = [];

// Function to read and send messages from say.txt
function startMessageLoop() {
  // Read all messages at startup
  loadMessages();
  
  setInterval(() => {
    try {
      if (messages.length > 0) {
        const message = messages[messageIndex];
        if (message) {
          bot.chat(message);
          console.log(`Sent message ${messageIndex + 1}/${messages.length}: ${message}`);
          
          // Move to next message, loop back to start when reaching end
          messageIndex = (messageIndex + 1) % messages.length;
        }
      } else {
        console.log('No messages found in say.txt');
        loadMessages(); // Try to reload messages
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, 4000); // Send message every 5 seconds
}

// Function to load messages from say.txt
function loadMessages() {
  try {
    if (fs.existsSync(sayFilePath)) {
      const fileContent = fs.readFileSync(sayFilePath, 'utf8');
      messages = fileContent.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0); // Remove empty lines
      
      console.log(`Loaded ${messages.length} messages from say.txt`);
      messageIndex = 0; // Reset to first message
    } else {
      console.log('say.txt file not found');
      messages = [];
    }
  } catch (error) {
    console.error('Error loading messages:', error);
    messages = [];
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down bot...');
  bot.quit();
  process.exit();
});
