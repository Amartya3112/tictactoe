# 🎮 Tic Tac Toe Multiplayer - User Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [How to Play](#how-to-play)
3. [Creating a Game Room](#creating-a-game-room)
4. [Joining a Game](#joining-a-game)
5. [Game Rules](#game-rules)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Step 1: Start the Server
Open your terminal/command prompt and run:

```bash
node server.js
```

You should see:
```
Server running on http://localhost:3000
```

### Step 2: Open the Game
Open your browser and go to:
```
http://localhost:3000
```

---

## 🎯 How to Play

### Creating a New Game Room

1. **Open the game** in your browser
2. **Copy the room link** from the "Share this link" section
3. **Send the link** to your friend (via chat, email, etc.)
4. **Wait** for your friend to join

Example link:
```
http://localhost:3000/?room=abc123
```

### Joining a Game

1. **Click the link** your friend sent you
2. The game will automatically join the room
3. **Wait** for the game to start (2 players needed)

---

## 🎮 Game Rules

### Objective
Be the first player to get **3 of your symbols in a row** (horizontal, vertical, or diagonal).

### Player Assignment
- **Player 1** (first to join) = **X** (goes first)
- **Player 2** (second to join) = **O** (goes second)

### Taking Turns
1. Wait for your turn indicator
2. Click on any empty cell
3. Your move instantly appears on opponent's screen
4. Turn passes to opponent

### Winning
- Get 3 X's or O's in a row
- Winning cells will glow and animate

### Draw
- If all 9 cells are filled with no winner
- Game ends in a draw

### Starting a New Game
- Click the **"New Game"** button
- Both players' boards reset
- Player X goes first again

---

## 📱 Game Features

### Visual Indicators
| Feature | Description |
|---------|-------------|
| **Status Bar** | Shows whose turn it is or game result |
| **Player X** | Blue/purple color with glow effect |
| **Player O** | Pink color with glow effect |
| **Winning Cells** | Animated gradient highlight |
| **Scoreboard** | Tracks wins for both players |

### Theme Toggle
- Click the **sun/moon icon** to switch between dark and light mode
- Your preference is saved automatically

---

## 🔗 Room System Explained

### What is a Room?
A room is a unique game session identified by a code in the URL.

### Room URL Format
```
http://localhost:3000/?room=YOUR_ROOM_CODE
```

### How Room Codes Work
- **Random 6-character code** (e.g., `abc123`, `xyz789`)
- **Each room is independent** - players in different rooms don't see each other
- **Max 2 players per room** - first 2 to join play together

### Sharing Your Room
1. Look for the **"Share this link"** section
2. Click the **"Copy Link"** button
3. Paste and send to your friend

---

## 🛠️ Troubleshooting

### Problem: "Waiting for opponent..." stays forever
**Solution:**
- Make sure your friend clicked the exact link you sent
- Check that the server is running (`node server.js`)
- Try refreshing both browsers

### Problem: Can't click cells
**Solution:**
- It's not your turn - wait for opponent
- Game might be over - click "New Game"
- You might be a spectator (3rd+ player in room)

### Problem: Moves not syncing
**Solution:**
- Check both players are in the same room (same URL)
- Refresh both pages
- Make sure server is running

### Problem: Server won't start
**Solution:**
- Make sure you installed dependencies:
  ```bash
  npm install
  ```
- Check if port 3000 is already in use
- Try a different port in `server.js`

### Problem: "Connection refused" error
**Solution:**
- Make sure server is running
- Check you're using `http://localhost:3000` (not `file://`)
- Try restarting the server

---

## 💡 Tips

1. **Test locally first** - Open the game in two browser tabs to test
2. **Copy the full link** - Include the `?room=` part
3. **Don't refresh during game** - You'll lose your connection
4. **Use New Game** - Resets both players' boards properly

---

## 🌐 Playing Online (Deployment)

### Option 1: Local Network
1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` or `ip a`
2. Share link: `http://YOUR_IP:3000/?room=abc123`
3. Both devices must be on same WiFi

### Option 2: Free Hosting (Render.com)
1. Push code to GitHub
2. Create account on [render.com](https://render.com)
3. Create new "Web Service"
4. Connect your GitHub repo
5. Deploy and get your public URL

### Option 3: Free Hosting (Glitch.com)
1. Go to [glitch.com](https://glitch.com)
2. Click "New Project"
3. Choose "Import from GitHub"
4. Paste your repo URL
5. Get your public `.glitch.me` URL

---

## 📞 Need Help?

If you encounter issues not covered here:
1. Check the browser console (F12) for errors
2. Check the server terminal for error messages
3. Make sure all files are in the same folder
4. Verify `package.json` has correct dependencies

---

**Enjoy playing Tic Tac Toe with your friends! 🎉**
