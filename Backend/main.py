from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import models, schemas, auth
from database import Base, engine, get_db

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# --- AUTH ROUTES ---
@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    new_user = models.User(username=user.username, hashed_password=auth.hash_password(user.password))
    db.add(new_user); db.commit()
    return {"msg": "User created"}

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Wrong username or password")
    token = auth.create_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

# --- PROTECTED EMPLOYEE ROUTES ---
@app.get("/employees", response_model=list[schemas.EmployeeResponse])
def get_employees(current_user: str = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    # you can filter by owner later:.filter(models.Employee.owner_id == current_user_id)
    return db.query(models.Employee).all()

@app.post("/employees", response_model=schemas.EmployeeResponse)
def create_employee(emp: schemas.EmployeeCreate, current_user: str = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    # get user id from username
    user_obj = db.query(models.User).filter(models.User.username == current_user).first()
    new_emp = models.Employee(**emp.model_dump(), owner_id=user_obj.id)
    db.add(new_emp); db.commit(); db.refresh(new_emp)
    return new_emp

@app.delete("/employees/{emp_id}")
def delete_employee(emp_id: int, current_user: str = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    db_emp = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if db_emp:
        db.delete(db_emp); db.commit()
    return {"deleted": emp_id}

# --- UPDATE EMPLOYEE ROUTE ---
@app.put("/employees/{emp_id}", response_model=schemas.EmployeeResponse)
def update_employee(emp_id: int, emp: schemas.EmployeeCreate, current_user: str = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    db_emp = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db_emp.name = emp.name
    db_emp.role = emp.role
    db_emp.active = emp.active
    
    db.commit()
    db.refresh(db_emp)
    return db_emp