# 🌵 Cactus Runner

Cactus Runner is a browser-based endless runner game where you control a cactus and jump over approaching dinosaurs.

The game supports keyboard, touch, and webcam hand-gesture controls using MediaPipe.

## 🎮 How to Play

Your goal is to avoid the dinosaurs and survive for as long as possible.

### Controls

- **Open Palm ✋:** Jump
- **Closed Fist ✊:** Prepare the next gesture jump
- **Spacebar:** Jump
- **Tap or click:** Jump
- **R key:** Restart after Game Over

Allow camera access when the browser asks for permission.

## ✨ Features

- Real-time webcam gesture controls
- Keyboard and mobile touch controls
- Random dinosaur speeds
- Random dinosaur spawn timing
- Smooth frame-rate-independent movement
- Increasing difficulty
- Collision detection
- Live score tracking
- Saved high score using localStorage
- Game Over and restart system
- Responsive gesture status messages

## 🛠️ Built With

- HTML
- CSS
- JavaScript
- Canvas API
- MediaPipe Gesture Recognizer
- Browser Local Storage

## 🚀 Running Locally

Because the game uses JavaScript modules and webcam access, run it through a local development server instead of opening the HTML file directly.

Using VS Code:

1. Install the Live Server extension.
2. Open the project folder.
3. Right-click `index.html`.
4. Select **Open with Live Server**.
5. Allow camera permission in your browser.

## 📁 Project Structure

```text
cactus-runner/
├── index.html
├── style.css
├── game.js
└── README.md