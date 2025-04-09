# API Routes Documentation

This document describes all the API routes available in the backend and how to test them using Postman.

---

## Base URL
```
http://localhost:5000/api
```

---

## Authentication Routes

### 1. Login
**Endpoint**: `POST /users/login`  
**Description**: Authenticate a user and return a JWT token.   
**Request Body**:
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```
**Response**:
- **200 OK**: Returns a token.
  ```json
  {
    "message": "Connexion réussie !",
    "token": "your-jwt-token"
  }
  ```
- **401 Unauthorized**: Invalid credentials.
  ```json
  {
    "message": "Données invalides"
  }
  ```

**Postman Steps**:
1. Open Postman and create a new `POST` request.
2. Set the URL to `http://localhost:5000/api/users/login`.
3. Go to the `Body` tab, select `raw`, and set the type to `JSON`.
4. Enter the request body as shown above.
5. Click `Send`.

---

### 2. Register
**Endpoint**: `POST /users/register`  
**Description**: Register a new user.  
**Request Body**:
```json
{
  "email": "newuser@example.com",
  "password": "password123"
}
```
**Response**:
- **201 Created**: User successfully registered.
  ```json
  {
    "message": "saved",
    "success": true
  }
  ```
- **401 Unauthorized**: User already exists.
  ```json
  {
    "message": "already sign up"
  }
  ```

**Postman Steps**:
1. Create a new `POST` request in Postman.
2. Set the URL to `http://localhost:5000/api/users/register`.
3. Go to the `Body` tab, select `raw`, and set the type to `JSON`.
4. Enter the request body as shown above.
5. Click `Send`.

---

## User Management Routes

### 3. Get All Users
**Endpoint**: `GET /users`  
**Description**: Retrieve all users.  
**Headers**:
```json
{
  "Authorization": "Bearer your-jwt-token"
}
```
**Response**:
- **200 OK**: Returns a list of users.
  ```json
  [
    {
      "_id": "userId",
      "email": "test@example.com",
      "password": "hashed-password"
    }
  ]
  ```
- **403 Forbidden**: Missing or invalid token.
  ```json
  {
    "message": "Token manquant"
  }
  ```

**Postman Steps**:
1. Create a new `GET` request in Postman.
2. Set the URL to `http://localhost:5000/api/users`.
3. Go to the `Headers` tab and add the `Authorization` header with the value `Bearer your-jwt-token`.
4. Click `Send`.

---

### 4. Get User by ID
**Endpoint**: `GET /users/:id`  
**Description**: Retrieve a user by their ID.  
**Headers**:
```json
{
  "Authorization": "Bearer your-jwt-token"
}
```
**Response**:
- **200 OK**: Returns the user.
  ```json
  {
    "_id": "userId",
    "email": "test@example.com",
    "password": "hashed-password"
  }
  ```
- **404 Not Found**: User not found.
  ```json
  {
    "message": "Utilisateur non trouvé"
  }
  ```

**Postman Steps**:
1. Create a new `GET` request in Postman.
2. Set the URL to `http://localhost:5000/api/users/{id}` (replace `{id}` with the user ID).
3. Go to the `Headers` tab and add the `Authorization` header with the value `Bearer your-jwt-token`.
4. Click `Send`.

---

### 5. Update User by ID
**Endpoint**: `PUT /users/:id`  
**Description**: Update a user's email or password.  
**Headers**:
```json
{
  "Authorization": "Bearer your-jwt-token"
}
```
**Request Body**:
```json
{
  "email": "updated@example.com",
  "password": "newpassword123"
}
```
**Response**:
- **200 OK**: User successfully updated.
  ```json
  {
    "message": "Utilisateur mis à jour",
    "updatedUser": {
      "_id": "userId",
      "email": "updated@example.com",
      "password": "hashed-password"
    }
  }
  ```
- **404 Not Found**: User not found.
  ```json
  {
    "message": "Utilisateur non trouvé"
  }
  ```

**Postman Steps**:
1. Create a new `PUT` request in Postman.
2. Set the URL to `http://localhost:5000/api/users/{id}` (replace `{id}` with the user ID).
3. Go to the `Headers` tab and add the `Authorization` header with the value `Bearer your-jwt-token`.
4. Go to the `Body` tab, select `raw`, and set the type to `JSON`.
5. Enter the request body as shown above.
6. Click `Send`.

---

### 6. Delete User by ID
**Endpoint**: `DELETE /users/:id`  
**Description**: Delete a user by their ID.  
**Headers**:
```json
{
  "Authorization": "Bearer your-jwt-token"
}
```
**Response**:
- **200 OK**: User successfully deleted.
  ```json
  {
    "message": "Utilisateur supprimé",
    "deletedUser": {
      "_id": "userId",
      "email": "test@example.com",
      "password": "hashed-password"
    }
  }
  ```
- **404 Not Found**: User not found.
  ```json
  {
    "message": "Utilisateur non trouvé"
  }
  ```

**Postman Steps**:
1. Create a new `DELETE` request in Postman.
2. Set the URL to `http://localhost:5000/api/users/{id}` (replace `{id}` with the user ID).
3. Go to the `Headers` tab and add the `Authorization` header with the value `Bearer your-jwt-token`.
4. Click `Send`.

---

## Notes
- Replace `your-jwt-token` with the token received from the login endpoint.
- Ensure the backend server is running before testing the routes.
- Use valid user IDs for routes requiring `:id`.
