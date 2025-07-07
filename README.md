
# 📸 Travel Story

A full-stack MERN application where users can create, view, edit, search, and filter travel stories with images, descriptions, and visited dates.

## 🧰 Tech Stack

**Frontend:** React, Tailwind CSS, Axios, React Icons, React Day Picker  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT Auth  
**Image Upload:** Multer  


---

## 📁 Project Structure

Travel-story/
│
├── backend/               # Express server & MongoDB models
├── frontend/              # React app
├── .gitignore
├── README.md
└── .env.example

---

## 🚀 Features

- 🔐 **Authentication** (JWT-based)
- 📸 **Upload travel stories** with image, location & date
- 🔍 **Search & filter** stories by keyword or date
- 🌟 **Mark stories as Favourite**
- ✏️ **Edit/Delete** travel stories
- 🎨 Responsive UI
- 📦 Image hosting with Multer
- 📂 Separate modals for adding, viewing, editing stories

---


## ⚙️ Environment Variables

### Backend `.env`

ACCESS_TOKEN_SECRET=your_secret_key
MONGO_URI=your_mongodb_connection_string

### Frontend `.env`

REACT_APP_API_URL=your_aoo_url

---

## 📦 Setup Instructions

### 1. Clone the repository

```bash
https://github.com/GAGGZ1/Travel-Story.git
cd travel-story
```
⸻

2. Backend Setup
```
cd backend
npm install
# Add your .env file
npm start
```

⸻

3. Frontend Setup

```
cd frontend
npm install
# Add your .env file
npm start
```

⸻

🧪 API Endpoints (Backend)

Method	Endpoint	Description
POST	/create-account	Register a new user
POST	/login	Login and get JWT token
GET	/get-user	Get user info (auth required)
POST	/add-travel-story	Add a new travel story
PUT	/edit-story/:id	Edit existing story
DELETE	/delete-story/:id	Delete story
GET	/get-all-stories	Fetch all user stories
GET	/search?query=	Search stories
GET	/travel-stories/filter	Filter stories by date
PUT	/update-is-favourite/:id	Toggle favourite


⸻

🔐 Authentication
	•	Uses JWT for protected routes.
	•	Frontend stores token in localStorage.

⸻

🛡️ Security Features
	•	Passwords are hashed with bcrypt
	•	API routes are protected using JWT middleware
	•	Input validation and sanitization included

⸻

📤 Deployment

Deployed with Render:
	•	Frontend: Static site with npm run build
	•	Backend: Web service with Express

⸻

🙋‍♂️ Author

Gagan Chauhan
https://github.com/GAGGZ1
https://www.linkedin.com/in/gaganchauhan/

