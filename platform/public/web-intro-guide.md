# Web Applications 101

Welcome to the **Web Penetration Testing** course. Before we break into systems, we must understand how they are built.

## Architecture of a Web App

Modern web applications are split into two primary components:
- **Frontend (Client-Side)**: This is what runs in your browser (HTML, CSS, JavaScript). It's responsible for the user interface and sending requests to the server.
- **Backend (Server-Side)**: This is the brain of the operation. It processes requests, interacts with databases, handles authentication, and sends data back to the client.

### The HTTP Protocol

The web runs on HTTP (Hypertext Transfer Protocol). When you interact with a web app, your browser sends HTTP **Requests** to the server, and the server replies with HTTP **Responses**.

#### Anatomy of a Request:
```http
POST /api/login HTTP/1.1
Host: target-site.com
Content-Type: application/json

{"username": "admin", "password": "password123"}
```
- **Method**: Defines the action (`GET` for fetching data, `POST` for sending data).
- **Endpoint**: The URL path being accessed (`/api/login`).
- **Headers**: Metadata about the request (e.g., `Content-Type`).
- **Body**: The actual payload data being sent (often JSON or form data).

#### Anatomy of a Response:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{"status": "success", "token": "eyJhbGciOiJIUzI1Ni..."}
```
- **Status Code**: Indicates the result (`200 OK`, `404 Not Found`, `500 Server Error`).
- **Body**: The data returned (HTML, JSON, etc).

## The Attack Surface

As a penetration tester, your goal is to manipulate the data sent from the client (Requests) in ways the server-side developers did not anticipate. 
This includes:
- **Input Manipulation**: Injecting SQL commands, JavaScript (XSS), or system commands into input fields.
- **Authentication Bypass**: Finding flaws in how tokens or cookies are verified.
- **Business Logic Flaws**: Exploiting the intended flow of the application to achieve unintended results (e.g., moving to negative balances in a bank app).

Next, we will move on to one of the most destructive and common web vulnerabilities: **SQL Injection (SQLi)**.
