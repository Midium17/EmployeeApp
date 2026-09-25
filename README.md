# Employee Management App 🚀

A modern full-stack CRUD (Create, Read, Update, Delete) web application designed to manage company employees. Built to demonstrate clean architecture separating database connection, data modeling, validation schemas, and API routing.

---

## 🛠️ Tech Stack

* **Backend:** Python, FastAPI, SQLAlchemy, SQLite, Pydantic, Uvicorn
* **Frontend:** React.js, Axios, JavaScript (ES6+)
* **Architecture:** RESTful API with Dependency Injection (`Depends(get_db)`)

---

## ✨ Features

* **Persistent Storage:** SQLite database integration ensures data is saved across server restarts.
* **Full CRUD Operations:** Add new employees, view the live roster, edit details using a dynamic shared form, and delete records instantly.
* **Live Search Filter:** Instantly filter employees by name as you type.
* **Input Validation:** Pydantic schemas enforce robust data validation on all incoming requests.
* **Interactive API Docs:** Auto-generated Swagger UI available out of the box via FastAPI.

---

## 📁 Project Structure

```text
employee-app/
│
├── backend/
│   ├── main.py          # FastAPI application & API endpoints
│   ├── database.py      # SQLAlchemy engine & session setup
│   ├── models.py        # Database table models
│   └── schemas.py       # Pydantic data validation models
│
└── frontend/
    └── src/
        └── App.js       # React frontend with Axios integration & state management
