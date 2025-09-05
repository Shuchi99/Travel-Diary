# 🌍 Shuchi - Travel Diary

A **MERN stack travel diary application** where users can log their journeys, upload photos, filter/search stories by date or keyword, and explore location-based suggestions powered by **Elasticsearch**. Media storage is handled with **Cloudinary**.

---

## ✨ Features

- 🔐 **User Authentication** – Secure signup/login with JWT.
- 📖 **Travel Stories** – Add, view, edit, and delete your journeys.
- 🖼️ **Image Upload** – Upload and manage travel photos via Cloudinary.
- 📍 **Location Autocomplete** – Smart location suggestions powered by Elasticsearch.
- 🔎 **Search & Filters**  
  - Search by title, description, or visited locations.  
  - Filter stories by date range.
- 📅 **Interactive Calendar** – Select travel dates with a calendar picker.
- 🎨 **Modern UI** – Built with React, Tailwind CSS, and `react-icons`.

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- React Router
- Axios
- React-Toastify
- React-Day-Picker
- Tailwind CSS

**Backend**
- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt (password hashing)
- Multer + Cloudinary (image storage)
- Elasticsearch (location indexing & suggestions)

---

## 📂 Project Structure

```
/frontend              # React frontend
  /components          # Reusable UI components
  /pages               # Feature pages (Home, Login, etc.)
  /utils               # Helpers (axios instance, image upload, etc.)

/backend               # Express backend
  /models              # Mongoose schemas
  /routes              # Express routes
  /services            # Elasticsearch & Cloudinary configs
  index.js             # Server entrypoint
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repo
```bash
git clone https://github.com/your-username/Travel-Diary.git
cd Travel-Diary
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `server/`:
```env
# MongoDB
CONNECTION_STRING=mongodb+srv://...

# JWT Secret
ACCESS_TOKEN_SECRET=your-secret-key

# Cloudinary
CLOUDINARY_URL="YOUR-URL"

# Elasticsearch
ELASTIC_NODE=https://your-elasticsearch-host
ELASTIC_API_KEY="your-elastic-api-key"
```

Run backend:
```bash
cd backend
npm start
```
Server runs on **http://localhost:8000**

---

### 3️⃣ Frontend Setup
```bash
cd frontend
cd travel-app
npm install
```

Update `utils/constants.js`:
```js
export const BASE_URL = "http://localhost:8000";
```

Run frontend:
```bash
npm run dev
```
App runs on **http://localhost:5173**

---

## 🚀 Deployment

- **Frontend** → Deploy to [Render](https://render.com), Netlify, or Vercel.  
- **Backend** → Deploy to [Render](https://render.com).  
- **Database** → Use [MongoDB Atlas](https://www.mongodb.com/atlas).  
- **Elasticsearch** → Use [Elastic Cloud](https://cloud.elastic.co).  
- **Cloudinary** → Free storage for travel images.  

When deploying, update environment variables in **Render Dashboard** and point frontend `BASE_URL` to the deployed backend URL.

---

## 🔑 API Endpoints (Backend)

| Method | Endpoint            | Description                     | Auth |
|--------|---------------------|---------------------------------|------|
| POST   | `/create-account`   | Register new user              | ❌   |
| POST   | `/login`            | Login                          | ❌   |
| GET    | `/get-user`         | Get user profile               | ✅   |
| POST   | `/add-travel`       | Add a new travel story         | ✅   |
| GET    | `/get-all-travels`  | Fetch all user stories         | ✅   |
| PUT    | `/edit-travel/:id`  | Update a travel story          | ✅   |
| DELETE | `/delete-travel/:id`| Delete a travel story          | ✅   |
| GET    | `/search-travel`    | Search stories by keyword      | ✅   |
| GET    | `/travel/filter`    | Filter stories by date range   | ✅   |
| POST   | `/image-upload`     | Upload image to Cloudinary     | ✅   |
| GET    | `/suggest-locations`| Get location suggestions (ES)  | ❌   |

---

## 🧑‍💻 Author

Developed as part of the **Shuchi - React Travel Diary** project.  
