# ✨ VYNZO

<p align="center">
  <img src="https://img.shields.io/badge/VYNZO-Social%20Media-7c3aed?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MERN-Stack-111827?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React-Frontend-61dafb?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge" />
</p>

<p align="center">
  <b>Share your world. Connect with your people.</b>
</p>

<p align="center">
  📸 Moments &nbsp; • &nbsp;
  📖 Stories &nbsp; • &nbsp;
  🎬 Reels &nbsp; • &nbsp;
  ❤️ Likes &nbsp; • &nbsp;
  💬 Comments
</p>

---

## 🌌 Welcome to Vynzo

**Vynzo** is a social media platform created to bring people, moments and creativity together.

From sharing photos and videos to discovering reels and connecting with people, Vynzo provides a complete social media experience with a clean, modern and interactive interface.

> **Your moments. Your people. Your Vynzo.**

---

# 🚀 Features

### 🔐 Authentication

* User registration
* User login
* JWT authentication
* Protected routes
* Secure user access

### 🏠 Home Feed

* View social media posts
* Upload photos
* Upload videos
* Like / unlike posts
* Add comments
* Delete your own posts

### 📖 Stories

* Share moments through stories
* Image and video support
* Story-style viewing experience

### 🎬 Reels

* Upload video reels
* Watch short-form content
* Discover entertaining videos

### 🔎 Explore

* Discover new content
* Explore posts
* Discover creators
* Trending sections
* Find new communities

### 👤 Profiles

* User information
* Username
* User posts
* Social interactions

### 🎨 Modern UI

* Glassmorphism design
* Gradient backgrounds
* Smooth animations
* Interactive cards
* Responsive layout
* Mobile-friendly interface

---

# 🧩 Vynzo Journey

```text
              🌐 VYNZO
                  │
        ┌─────────┴─────────┐
        │                   │
     🔐 Login           🚀 Explore
        │                   │
        ▼                   ▼
     🏠 Home          🔎 Discover
        │                   │
   ┌────┼────┐              │
   │    │    │              │
  📸   📖   🎬              │
 Post Story Reel             │
   │    │    │              │
   └────┼────┘              │
        │                   │
        ▼                   ▼
     ❤️ Like          👥 Connect
        │                   │
        └─────────┬─────────┘
                  ▼
                💜 VYNZO
```

---

# 🛠️ Tech Stack

## Frontend

| Technology      | Purpose              |
| --------------- | -------------------- |
| ⚛️ React.js     | User Interface       |
| 🧭 React Router | Page Navigation      |
| 📡 Axios        | API Requests         |
| 🎨 CSS3         | Styling & Animations |
| ⚡ Vite          | Frontend Development |

## Backend

| Technology    | Purpose        |
| ------------- | -------------- |
| 🟢 Node.js    | Server Runtime |
| 🚂 Express.js | REST API       |
| 🍃 MongoDB    | Database       |
| 🦫 Mongoose   | MongoDB ODM    |
| 🔐 JWT        | Authentication |
| 📁 Multer     | Media Uploads  |

---

# 🏗️ Project Architecture

```text
VYNZO/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   │
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 🔐 Authentication Flow

```text
👤 User
   │
   ▼
📝 Register
   │
   ▼
🔑 Login
   │
   ▼
🔐 JWT Token
   │
   ▼
🛡️ Protected API
   │
   ▼
🏠 Vynzo Home
```

---

# 📸 Content Flow

Vynzo supports different types of social content:

```text
                 📁 MEDIA
                    │
          ┌─────────┼─────────┐
          │         │         │
        🖼️ Image  🎥 Video  🎬 Video
          │         │         │
          ▼         ▼         ▼
         POST      POST      REEL
                              │
                              ▼
                            🎬 Feed

                 📖 STORIES
                     │
               🖼️ Image / 🎥 Video
```

---

# ❤️ Social Interaction

Vynzo is designed around interaction and connection.

```text
📸 Create Post
      ↓
👥 Share
      ↓
❤️ Like
      ↓
💬 Comment
      ↓
🔎 Discover
      ↓
💜 Connect
```

---

# ✨ Landing Page

The Vynzo landing page introduces the platform with:

* ✨ Modern gradient design
* 🪟 Glassmorphism cards
* 📖 Story preview
* 📸 Post preview
* 🎬 Reel preview
* 🔔 Notification animation
* 🚀 Get Started button
* 🔎 Explore page
* ℹ️ About page

---

# 📱 Pages

| Page        | Description         |
| ----------- | ------------------- |
| 🏠 Landing  | Vynzo introduction  |
| 🔐 Login    | User authentication |
| 📝 Register | Create an account   |
| 🏠 Home     | Social media feed   |
| 🔎 Explore  | Discover content    |
| ℹ️ About    | About Vynzo         |

---

# ⚙️ Getting Started

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

```bash
cd VYNZO
```

---

## 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

---

## 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

---

# 🔒 Environment Variables

Never upload your `.env` file to GitHub.

Add this to `.gitignore`:

```text
.env
node_modules/
uploads/
```

---

# 🌍 Live Demo

🚀 **Live Website**

https://vynzo-app.vercel.app/

💻 **GitHub Repository**

https://github.com/tannu01-dev/Vynzo-App

---


# 🔮 Future Improvements

Vynzo can be expanded with:

* 👥 Follow / Unfollow
* 💬 Real-time Chat
* 🔔 Notifications
* 📡 Socket.io real-time updates
* 🟢 Online / Offline status
* 🔍 Advanced Search
* 🎬 Advanced Reels Feed
* 📖 Improved Story System
* ☁️ Cloud Media Storage
* 🌙 Dark Mode
* 📱 PWA Support

---

# 🎯 Project Vision

Vynzo is built around a simple idea:

```text
        CREATE
          ↓
        SHARE
          ↓
       DISCOVER
          ↓
        CONNECT
```

The goal is to make social media feel **simple, creative and human**.

---

# 💜 Why Vynzo?

Because social media should be more than just scrolling.

It should be about:

**Moments worth sharing.**
**People worth connecting with.**
**Stories worth discovering.**

That's **Vynzo**.

---

# 👩‍💻 Developer

### Tannu Pal

Built with:

**React • Node.js • Express • MongoDB • JavaScript**

and a lot of ☕ + 💻 + 🐛 → 🛠️

---

# ⭐ Show Some Love

If you like **Vynzo**, consider giving this repository a ⭐.

It really helps! 💜

---

<p align="center">
  <b>✨ VYNZO ✨</b>
</p>

<p align="center">
  Your moments. Your people. Your world.
</p>
