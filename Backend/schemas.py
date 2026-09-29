from pydantic import BaseModel

class EmployeeCreate(BaseModel):
    name: str
    role: str
    active: bool = True

class EmployeeResponse(EmployeeCreate):
    id: int
    owner_id: int
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"  # user can request admin, but we will control it