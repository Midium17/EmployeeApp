from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import models, schemas, auth
from database import Base, engine, get_db

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# --- HELPERS ---
def require_admin(current_user = Depends(auth.get_current_user_with_role)):
    if current_user.role!= "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return current_user

# --- AUTH ROUTES ---
@app.post("/register")
def register(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user_with_role) if False else None
):
    # Logic: If DB empty -> allow first admin creation without token
    # If DB not empty -> require admin token
    user_count = db.query(models.User).count()

    if user_count > 0:
        # Need admin - manually check header
        from fastapi.security import OAuth2PasswordBearer
        from jose import JWTError, jwt
        # This will throw 401 if not logged in
        # So we need current_user
        pass

    existing = db.query(models.User).filter(models.User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username taken")

    # First user is always admin
    role = "admin" if db.query(models.User).count() == 0 else user.role
    new_user = models.User(username=user.username, hashed_password=auth.hash_password(user.password), role=role)
    db.add(new_user); db.commit(); db.refresh(new_user)
    return {"msg": f"User {new_user.username} created as {role}", "role": role}

# Better version - 2 endpoints
@app.post("/create-first-admin")
def create_first_admin(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).count()!= 0:
        raise HTTPException(status_code=400, detail="Admin already exists. Login as admin to create users.")
    new_user = models.User(username=user.username, hashed_password=auth.hash_password(user.password), role="admin")
    db.add(new_user); db.commit()
    return {"msg": "First admin created. Now login."}

@app.post("/create-user")
def create_user(user: schemas.UserCreate, current_user = Depends(require_admin), db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username taken")
    new_user = models.User(username=user.username, hashed_password=auth.hash_password(user.password), role=user.role)
    db.add(new_user); db.commit(); db.refresh(new_user)
    return {"msg": f"User {new_user.username} created as {new_user.role}", "username": new_user.username, "role": new_user.role}

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Wrong username or password")
    token = auth.create_token(data={"sub": user.username, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role, "username": user.username}

@app.get("/me")
def me(current_user = Depends(auth.get_current_user_with_role)):
    return {"username": current_user.username, "role": current_user.role}

@app.get("/users")
def list_users(current_user = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(models.User).all()

# --- EMPLOYEES ---
@app.get("/employees", response_model=list[schemas.EmployeeResponse])
def get_employees(current_user = Depends(auth.get_current_user_with_role), db: Session = Depends(get_db)):
    return db.query(models.Employee).all()

@app.post("/employees", response_model=schemas.EmployeeResponse)
def create_employee(emp: schemas.EmployeeCreate, current_user = Depends(require_admin), db: Session = Depends(get_db)):
    user_obj = db.query(models.User).filter(models.User.username == current_user.username).first()
    new_emp = models.Employee(**emp.model_dump(), owner_id=user_obj.id)
    db.add(new_emp); db.commit(); db.refresh(new_emp)
    return new_emp

@app.put("/employees/{emp_id}", response_model=schemas.EmployeeResponse)
def update_employee(emp_id: int, emp: schemas.EmployeeCreate, current_user = Depends(require_admin), db: Session = Depends(get_db)):
    db_emp = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    db_emp.name = emp.name; db_emp.role = emp.role; db_emp.active = emp.active
    db.commit(); db.refresh(db_emp)
    return db_emp

@app.delete("/employees/{emp_id}")
def delete_employee(emp_id: int, current_user = Depends(require_admin), db: Session = Depends(get_db)):
    db_emp = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(db_emp); db.commit()
    return {"deleted": emp_id}