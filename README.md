Perfect 👍
Neeche **READY-TO-USE `README.md` content** + **GitHub push steps (step-by-step)** de raha hoon.
👉 Bas **copy–paste** karo, kaam ho jayega.

---

# 📄 **README.md (COPY–PASTE READY)**

````md
# 📝 Task Management System (MERN Stack)

A modern **Task Management System** built using the **MERN Stack (MongoDB, Express, React, Node.js)**.  
This application helps users manage tasks efficiently with authentication, priority-based task organization, and a clean dashboard UI.

---

## 🚀 Features

### 🔐 User Authentication
- User Registration & Login
- JWT-based authentication
- Secure logout functionality

### ✅ Task Management
- Create tasks with:
  - Title
  - Description
  - Due Date
  - Status (To-Do, In Progress, Completed)
  - Priority (Most Important, Important, Least Important)
- View task details in a modal
- Edit existing tasks
- Delete tasks with confirmation dialog
- Update task status easily

### 🎯 Priority Management
- Tasks are grouped and color-coded based on priority
- Easy visual identification of urgent tasks

### 📊 Dashboard
- Modern and responsive dashboard UI
- Task statistics (Total, Pending, In Progress, Completed)
- Sidebar navigation with user profile
- AJAX-based pagination for better performance

---

## 🛠 Tech Stack

### Frontend
- React.js
- CSS / Inline Styling
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git remote add origin https://github.com/Sumitkmt946/Task-Management-Pabbly.git
````

### 2️⃣ Backend Setup

```bash
cd backend
npm install
node server.js
```

Server will start on:

```
http://localhost:5000
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run on:

```
http://localhost:3000
```

---

## 📂 Project Structure

```
task-manager/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── api.js
│
└── README.md
```

---

## 🔐 Authentication Flow

* User logs in → JWT token stored in localStorage
* Protected routes accessible only when token exists
* Logout clears token and redirects to login page

---

## 📸 Screenshots

* Login Page
* Register Page
* Dashboard
* Add Task Modal
* Task Details Modal

*(Screenshots can be added here)*

---

## 👨‍💻 Author

**Sumit Kumawat**

---

## 📌 Conclusion

This project demonstrates a complete CRUD-based task management system with authentication, priority handling, and a modern UI, suitable for real-world applications and technical assessments.

````
