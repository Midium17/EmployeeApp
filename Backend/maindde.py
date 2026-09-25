from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow React to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fake DB for now (later use SQLite)
employees_db = []

class Employee(BaseModel):
    id: int
    name: str
    role: str
    active: bool = True

@app.get("/")
def home():
    return {"message": "API is working"}

@app.get("/employees", response_model=List[Employee])
def get_employees():
    return employees_db

@app.post("/employees")
def add_employee(emp: Employee):
    employees_db.append(emp)
    return emp

@app.delete("/employees/{emp_id}")
def delete_employee(emp_id: int):
    global employees_db
    employees_db = [e for e in employees_db if e.id!= emp_id]
    return {"deleted": emp_id}