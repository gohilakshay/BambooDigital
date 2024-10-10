# # main.py
# from fastapi import FastAPI, Depends, HTTPException, Body
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from jose import JWTError, jwt
# from pydantic import BaseModel
# from pymongo import MongoClient
# from passlib.context import CryptContext
# from datetime import datetime, timedelta
# from bson import ObjectId
# import os
# from dotenv import load_dotenv
# import requests
# import logging

# load_dotenv()  # Load environment variables from .env file

# app = FastAPI()

# # CORS setup
# origins = [
#     "http://localhost:3000",
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # MongoDB setup
# MONGODB_URI = os.getenv("MONGODB_URI")
# client = MongoClient(MONGODB_URI+ "&tls=true&tlsAllowInvalidCertificates=true")
# db = client["content_management"]

# # JWT setup
# SECRET_KEY = os.getenv("SECRET_KEY")
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")



# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# class User(BaseModel):
#     email: str
#     password: str

# class Product(BaseModel):
#     name: str
#     description: str

# class BrandDetails(BaseModel):
#     brand_name: str
#     products: list[Product]

# class Content(BaseModel):
#     content: str

# class GenContentRequest(BaseModel):
#     text: str

# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# def get_password_hash(password):
#     return pwd_context.hash(password)

# def create_access_token(data: dict, expires_delta: timedelta = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.utcnow() + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(minutes=15)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

# async def get_current_user(token: str = Depends(oauth2_scheme)):
#     credentials_exception = HTTPException(
#         status_code=401,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email: str = payload.get("sub")
#         if email is None:
#             raise credentials_exception
#     except JWTError:
#         raise credentials_exception
#     user = db.users.find_one({"email": email})
#     if user is None:
#         raise credentials_exception
#     return user

# @app.post("/register")
# async def register(user: User):
#     user.password = get_password_hash(user.password)
#     db.users.insert_one(user.dict())
#     return {"msg": "User registered successfully"}

# @app.post("/token")
# async def login(form_data: OAuth2PasswordRequestForm = Depends()):
#     user = db.users.find_one({"email": form_data.username})
#     if not user or not verify_password(form_data.password, user["password"]):
#         raise HTTPException(status_code=401, detail="Invalid credentials")
#     access_token = create_access_token(data={"sub": user["email"]})
#     return {"access_token": access_token, "token_type": "bearer"}

# @app.post("/brand-details")
# async def save_brand_details(brand_details: BrandDetails, user: dict = Depends(get_current_user)):
#     db.brand_details.insert_one(brand_details.dict())
#     return {"msg": "Brand details saved successfully"}

# @app.put("/brand-details/{brand_id}")
# async def update_brand_details(brand_id: str, brand_details: BrandDetails, user: dict = Depends(get_current_user)):
#     result = db.brand_details.update_one({"_id": ObjectId(brand_id)}, {"$set": brand_details.dict()})
#     if result.matched_count == 0:
#         raise HTTPException(status_code=404, detail="Brand not found")
#     return {"msg": "Brand details updated successfully"}

# @app.delete("/brand/{brand_id}/product/{product_id}")
# async def delete_product(brand_id: str, product_id: str, user: dict = Depends(get_current_user)):
#     try:
#         result = db.brands.update_one(
#             {"_id": ObjectId(brand_id), "user_id": user["_id"]},
#             {"$pull": {"products": {"_id": ObjectId(product_id)}}}
#         )
#         if result.modified_count == 0:
#             raise HTTPException(status_code=404, detail="Product not found")
#         return {"message": "Product deleted successfully"}
#     except Exception as e:
#         logger.error(f"Failed to delete product: {e}")
#         raise HTTPException(status_code=500, detail="Failed to delete product")

# @app.delete("/brand-details/{brand_id}")
# async def delete_brand_details(brand_id: str, user: dict = Depends(get_current_user)):
#     result = db.brand_details.delete_one({"_id": ObjectId(brand_id)})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Brand not found")
#     return {"msg": "Brand details deleted successfully"}

# @app.delete("/brand/{brand_id}")
# async def delete_brand(brand_id: str, user: dict = Depends(get_current_user)):
#     try:
#         brand = db.brands.find_one({"_id": ObjectId(brand_id), "user_id": user["_id"]})
#         if not brand:
#             raise HTTPException(status_code=404, detail="Brand not found")
#         if len(brand.get("products", [])) > 0:
#             raise HTTPException(status_code=400, detail="Please delete all products within the brand before deleting the brand.")
#         db.brands.delete_one({"_id": ObjectId(brand_id), "user_id": user["_id"]})
#         return {"message": "Brand deleted successfully"}
#     except Exception as e:
#         logger.error(f"Failed to delete brand: {e}")
#         raise HTTPException(status_code=500, detail="Failed to delete brand")

# @app.post("/generate-content")
# async def generate_content(request: GenContentRequest, user: dict = Depends(get_current_user)):
#     try:
#         gemini_api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
#         api_key = os.getenv("GEMINI_API_KEY")
        
#         payload = {
#             "contents": [
#                 {
#                     "parts": [
#                         {"text": request.text}  # Use the text from the request
#                     ]
#                 }
#             ]
#         }
        
#         headers = {
#             "Content-Type": "application/json"
#         }
        
#         logger.info(f"Sending request to Gemini API: {gemini_api_url}")
#         response = requests.post(f"{gemini_api_url}?key={api_key}", json=payload, headers=headers)
#         response.raise_for_status()
        
#         candidates = response.json().get("candidates", [])
#         generated_content = ""
        
#         for candidate in candidates:
#             content = candidate.get("content", {})
#             parts = content.get("parts", [])
#             for part in parts:
#                 generated_content += part.get("text", "") + "\n"
        
#         if not generated_content:
#             generated_content = "Generated content based on brand details"
        
#         return {"content": generated_content.strip()}
    
#     except requests.exceptions.HTTPError as http_err:
#         logger.error(f"HTTP error occurred: {http_err}")
#         raise HTTPException(status_code=response.status_code, detail=f"HTTP error occurred: {http_err}")
#     except requests.exceptions.ConnectionError as conn_err:
#         logger.error(f"Connection error occurred: {conn_err}")
#         raise HTTPException(status_code=500, detail=f"Connection error occurred: {conn_err}")
#     except requests.exceptions.Timeout as timeout_err:
#         logger.error(f"Timeout error occurred: {timeout_err}")
#         raise HTTPException(status_code=500, detail=f"Timeout error occurred: {timeout_err}")
#     except requests.exceptions.RequestException as req_err:
#         logger.error(f"An error occurred: {req_err}")
#         raise HTTPException(status_code=500, detail=f"An error occurred: {req_err}")
        
# @app.post("/save-content")
# async def save_content(content: Content, user: dict = Depends(get_current_user)):
#     db.content.insert_one(content.dict())
#     return {"msg": "Content saved successfully"}

# @app.get("/content-list")
# async def get_content_list(user: dict = Depends(get_current_user)):
#     content_list = db.content.find()
#     return {"content": [content["content"] for content in content_list]}
from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel
from pymongo import MongoClient
from passlib.context import CryptContext
from datetime import datetime, timedelta
from bson import ObjectId
import os
from dotenv import load_dotenv
import requests
import logging
from typing import Optional  # Add this line


load_dotenv()  # Load environment variables from .env file

app = FastAPI()

# CORS setup
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB setup
MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGODB_URI + "&tls=true&tlsAllowInvalidCertificates=true")
db = client["content_management"]

# JWT setup
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class User(BaseModel):
    email: str
    password: str

class Product(BaseModel):
    name: str
    description: str
    generated_content: Optional[str] = None  # Add this line


class BrandDetails(BaseModel):
    brand_name: str
    products: list[Product]

class Content(BaseModel):
    content: str

class GenContentRequest(BaseModel):
    text: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.users.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user

@app.post("/register")
async def register(user: User):
    user.password = get_password_hash(user.password)
    db.users.insert_one(user.dict())
    return {"msg": "User registered successfully"}

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/brand-details")
async def save_brand_details(brand_details: BrandDetails, user: dict = Depends(get_current_user)):
    brand_details_dict = brand_details.dict()
    brand_details_dict["user_id"] = user["_id"]
    db.brand_details.insert_one(brand_details_dict)
    return {"msg": "Brand details saved successfully"}

@app.put("/brand-details/{brand_id}")
async def update_brand_details(brand_id: str, brand_details: BrandDetails, user: dict = Depends(get_current_user)):
    result = db.brand_details.update_one(
        {"_id": ObjectId(brand_id), "user_id": user["_id"]},
        {"$set": brand_details.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Brand not found")
    return {"msg": "Brand details updated successfully"}

@app.put("/brand/{brand_id}")
async def edit_brand(brand_id: str, brand_details: BrandDetails, user: dict = Depends(get_current_user)):
    try:
        # Convert Product objects to dictionaries
        products_dict = [product.dict() for product in brand_details.products]
        
        result = db.brand_details.update_one(
            {"_id": ObjectId(brand_id), "user_id": user["_id"]},
            {"$set": {
                "brand_name": brand_details.brand_name,
                "products": products_dict
            }}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Brand not found or not updated")
        return {"message": "Brand updated successfully"}
    except Exception as e:
        logger.error(f"Failed to edit brand: {e}")
        raise HTTPException(status_code=500, detail="Failed to edit brand")

@app.put("/brand/{brand_id}/product/{product_index}")
async def edit_product(brand_id: str, product_index: int, product: Product, user: dict = Depends(get_current_user)):
    try:
        brand = db.brand_details.find_one({"_id": ObjectId(brand_id), "user_id": user["_id"]})
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        if product_index < 0 or product_index >= len(brand["products"]):
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Update the product at the specified index
        brand["products"][product_index] = {
            "name": product.name,
            "description": product.description,
            "generated_content": product.generated_content
        }
        
        # Update the brand details in the database
        result = db.brand_details.update_one(
            {"_id": ObjectId(brand_id), "user_id": user["_id"]},
            {"$set": {"products": brand["products"]}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to update product")
        
        return {"message": "Product updated successfully"}
    except Exception as e:
        logger.error(f"Failed to edit product: {e}")
        raise HTTPException(status_code=500, detail="Failed to edit product")

@app.delete("/brand/{brand_id}/product/{product_index}")
async def delete_product(brand_id: str, product_index: int, user: dict = Depends(get_current_user)):
    try:
        brand = db.brand_details.find_one({"_id": ObjectId(brand_id), "user_id": user["_id"]})
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        if product_index < 0 or product_index >= len(brand["products"]):
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Remove the product at the specified index
        brand["products"].pop(product_index)
        
        # Update the brand details in the database
        result = db.brand_details.update_one(
            {"_id": ObjectId(brand_id), "user_id": user["_id"]},
            {"$set": {"products": brand["products"]}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to delete product")
        
        return {"message": "Product deleted successfully"}
    except Exception as e:
        logger.error(f"Failed to delete product: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete product")

@app.delete("/brand/{brand_id}")
async def delete_brand(brand_id: str, user: dict = Depends(get_current_user)):
    try:
        brand = db.brand_details.find_one({"_id": ObjectId(brand_id), "user_id": user["_id"]})
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        if len(brand.get("products", [])) > 0:
            raise HTTPException(status_code=400, detail="Please delete all products within the brand before deleting the brand.")
        db.brand_details.delete_one({"_id": ObjectId(brand_id), "user_id": user["_id"]})
        return {"message": "Brand deleted successfully"}
    except Exception as e:
        logger.error(f"Failed to delete brand: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete brand")

@app.post("/generate-content")
async def generate_content(request: GenContentRequest, user: dict = Depends(get_current_user)):
    try:
        gemini_api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
        api_key = os.getenv("GEMINI_API_KEY")
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": request.text}  # Use the text from the request
                    ]
                }
            ]
        }
        
        headers = {
            "Content-Type": "application/json"
        }
        
        logger.info(f"Sending request to Gemini API: {gemini_api_url}")
        response = requests.post(f"{gemini_api_url}?key={api_key}", json=payload, headers=headers)
        response.raise_for_status()
        
        candidates = response.json().get("candidates", [])
        generated_content = ""
        
        for candidate in candidates:
            content = candidate.get("content", {})
            parts = content.get("parts", [])
            for part in parts:
                generated_content += part.get("text", "") + "\n"
        
        if not generated_content:
            generated_content = "Generated content based on brand details"
        
        return {"content": generated_content.strip()}
    
    except requests.exceptions.HTTPError as http_err:
        logger.error(f"HTTP error occurred: {http_err}")
        raise HTTPException(status_code=response.status_code, detail=f"HTTP error occurred: {http_err}")
    except requests.exceptions.ConnectionError as conn_err:
        logger.error(f"Connection error occurred: {conn_err}")
        raise HTTPException(status_code=500, detail=f"Connection error occurred: {conn_err}")
    except requests.exceptions.Timeout as timeout_err:
        logger.error(f"Timeout error occurred: {timeout_err}")
        raise HTTPException(status_code=500, detail=f"Timeout error occurred: {timeout_err}")
    except requests.exceptions.RequestException as req_err:
        logger.error(f"An error occurred: {req_err}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {req_err}")

@app.post("/save-content")
async def save_content(content: Content, user: dict = Depends(get_current_user)):
    try:
        result = db.brand_details.update_one(
            {"_id": ObjectId(content.brand_id), "user_id": user["_id"], "products._id": ObjectId(content.product_id)},
            {"$set": {"products.$.generated_content": content.content}}  # Update this line
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Product not found or not updated")
        return {"msg": "Content saved successfully"}
    except Exception as e:
        logger.error(f"Failed to save content: {e}")
        raise HTTPException(status_code=500, detail="Failed to save content")

@app.get("/content-list")
async def get_content_list(user: dict = Depends(get_current_user)):
    print("BRAVOOO")
    try:
        contents = db.brand_details.find({"user_id": user["_id"]})
        content_list = []
        for content in contents:
            content_list.append({
                "brand_id": str(content["_id"]),
                "brand_name": content["brand_name"],
                "products": content["products"],
                "generated_content": content.get("generated_content", "")
            })
        return {"content": content_list}
    except Exception as e:
        logger.error(f"Failed to fetch content list: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch content list")
