# SQL Injection (SQLi)

In this module, you'll learn how to hijack databases by manipulating poorly constructed SQL queries.

## Understanding Databases & SQL

A relational database (like MySQL, PostgreSQL, or SQLite) stores data in tables. 
**SQL (Structured Query Language)** is used by the backend to communicate with the database.

A typical query to authenticate a user looks like this:
```sql
SELECT * FROM users WHERE username = 'alice' AND password = 'mySecretPassword123'
```
If this query returns a record, the backend logs the user in.

## The Vulnerability: SQL Injection

SQL Injection occurs when user input is directly concatenated into the SQL query without proper sanitization.

Imagine the backend code looks like this:
```javascript
let query = "SELECT * FROM users WHERE username = '" + req.body.username + "' AND password = '" + req.body.password + "'";
```

If an attacker inputs `admin' --` as the username, the query becomes:
```sql
SELECT * FROM users WHERE username = 'admin' --' AND password = ''
```
The `--` sequence comments out the rest of the query. The password check is completely ignored, and the attacker logs in as `admin`!

## Assessment: Retrieve the Flag

In this assessment, we have provided a vulnerable login portal running on port `4000`.

### Step-by-Step Guide
1. Ensure the vulnerable server is running. You can access it by opening `http://localhost:4000` in your browser.
2. You will see a login terminal. We know there is an administrator account with the username `admin`, but we don't know the password.
3. In the **Username** field, try entering a standard SQL injection authentication bypass payload:
   `admin' --`
4. Leave the **Password** field empty (or put anything).
5. Click **[ ATTEMPT_LOGIN ]**.
6. The backend will blindly execute your query, ignoring the password check. If successful, you will bypass the login screen and the system will reveal the secret administrator flag.
7. Return to the RakHack EdTech platform and submit the flag in the submission terminal below!
