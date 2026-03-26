# Livestock Cost Estimator API Documentation

## Overview

This document describes the authentication API currently exposed by the backend branch.

## Base URL

`/api/v1`

## Auth Base Path

`/api/v1/auth`

## Authentication Method

This backend uses **HTTP-only signed cookies** for authentication:

* `accessToken`
* `refreshToken`

Frontend requests that need cookies should be sent with credentials enabled.

---

## 1) Register User

**Endpoint**: `POST /api/v1/auth/register`

### Description

Creates a new user account, generates an email verification token, and sends a verification email.

### Validation Rules

* `name`: string, required, 3 to 50 characters
* `email`: valid email, required
* `password`: required, minimum 8 characters, must include:

  * uppercase letter
  * lowercase letter
  * number
  * special character from `@$#&!~_`

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password1@"
}
```

### Success Response

**Status**: `201 Created`

```json
{
  "msg": "Success! Please check your email to verify account"
}
```

### Possible Error Responses

**Status**: `400 Bad Request`

```json
{
  "msg": "validation error message(s)"
}
```

**Status**: `409 Conflict`

```json
{
  "msg": "Email already exists"
}
```

### Notes

* The first registered account is assigned the role `admin`.
* Every other new account is assigned the role `user`.
* The verification link points to the backend route:
  `GET /api/v1/auth/verify-email?token=...&email=...`

---

## 2) Verify Email

**Endpoint**: `GET /api/v1/auth/verify-email`

### Description

Verifies a user's email using the token and email from the query string.

### Query Parameters

* `token` (required)
* `email` (required)

### Example

```http
GET /api/v1/auth/verify-email?token=abc123&email=john@example.com
```

### Success Response

**Status**: `200 OK`

```json
{
  "msg": "Email verified successfully"
}
```

### Possible Error Responses

**Status**: `400 Bad Request`

```json
{
  "msg": "Invalid verification link"
}
```

**Status**: `401 Unauthorized`

```json
{
  "msg": "Verification failed"
}
```

---

## 3) Login

**Endpoint**: `POST /api/v1/auth/login`

### Description

Authenticates a verified user, stores refresh token data in the database, and sets signed auth cookies.

### Validation Rules

* `email`: valid email, required
* `password`: required

### Request Body

```json
{
  "email": "john@example.com",
  "password": "Password1@"
}
```

### Success Response

**Status**: `202 Accepted`

```json
{
  "msg": " welcome onboard John Doe "
}
```

### Cookies Set On Success

* `accessToken` (HTTP-only, signed, expires in about 1 day)
* `refreshToken` (HTTP-only, signed, expires in about 30 days)

### Possible Error Responses

**Status**: `400 Bad Request`

```json
{
  "msg": "validation error message(s)"
}
```

**Status**: `401 Unauthorized`

```json
{
  "msg": "Email does not exist, try correct email or create account"
}
```

```json
{
  "msg": "Incorrect Credentials"
}
```

```json
{
  "msg": "Please verify your email"
}
```

```json
{
  "msg": "Invalid Credentials"
}
```

### Frontend Note

For browser-based requests, send credentials so cookies are included.

---

## 4) Logout

**Endpoint**: `DELETE /api/v1/auth/logout`

### Description

Deletes the user's refresh token record and clears auth cookies.

### Authentication

Requires authenticated user via signed cookies.

### Success Response

**Status**: `200 OK`

```json
{
  "msg": "user log out"
}
```

### Possible Error Responses

**Status**: `401 Unauthorized`

```json
{
  "msg": "Authenticated Failed"
}
```

### Frontend Note

Send the request with credentials enabled.

---

## 5) Forgot Password

**Endpoint**: `POST /api/v1/auth/forgot-password`

### Description

If the email exists, generates a reset token, stores a hashed token plus expiry, and sends a reset email.

### Request Body

```json
{
  "email": "john@example.com"
}
```

### Success Response

**Status**: `200 OK`

```json
{
  "msg": "Please check your email for reset password link"
}
```

### Possible Error Responses

**Status**: `400 Bad Request`

```json
{
  "msg": "Please provide a valid email"
}
```

### Notes

* This endpoint returns the same success message whether the email exists or not.
* Reset token expiry is set to about 10 minutes.
* The email link points to the backend reset-password path with `token` and `email` in the URL.

---

## 6) Reset Password

**Endpoint**: `POST /api/v1/auth/reset-password`

### Description

Resets a user's password using the reset token, email, and new password.

### Request Body

```json
{
  "email": "john@example.com",
  "token": "reset_token_here",
  "newPassword": "NewPassword1@"
}
```

### Success Response

**Status**: `200 OK`

```json
{
  "msg": "Password reset successful"
}
```

### Possible Error Responses

**Status**: `400 Bad Request`

```json
{
  "msg": "Please provide email, token and new password"
}
```

```json
{
  "msg": "Invalid or expired reset link"
}
```

---

## Frontend Integration Notes

### Base Axios Example

```js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});
```

### Example Calls

```js
await api.post("/auth/register", {
  name: "John Doe",
  email: "john@example.com",
  password: "Password1@",
});

await api.post("/auth/login", {
  email: "john@example.com",
  password: "Password1@",
});

await api.delete("/auth/logout");
```

## Important Current Backend Notes

* Only the auth router is currently mounted in `server.js`.
* The backend currently uses hard-coded backend URLs in the email verification and password reset links.
* CORS is not visibly configured in `server.js`, so cross-origin frontend integration may fail until CORS is added.

## Summary for Frontend Dev

The frontend dev should not need to read backend source code to discover endpoints. This document is the API contract they can integrate against.
