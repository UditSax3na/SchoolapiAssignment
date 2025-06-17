# School API 

---

## Summary

This project implement APIs using Node.js, Express.js, and MySQL to manage school-related data, including locating nearby schools and adding new entries.

[Link](https://schoolapiassignment.onrender.com)


---
## Functionalities 
- ##### Find Closest Schools
    Retrieve a list of schools sorted by proximity to a user-specified location (latitude & longitude) using the Haversine formula.

- ##### Add New Schools
    Add new school entries to the database with name, address, latitude, and longitude.

---
## Tech Stack
- Node.js
- Express.js
- MySQL

---

## API Endpoints
- `GET /listSchools?lat=<latitude>&lng=<longitude>`
    _Returns a list of schools sorted by distance._


- `POST /addSchool`
    _Adds a new school to the database._
    
    **Requires a JSON body:**

    ```json
    {
        "name": "School Name",
        "address": "School Address",
        "latitude": 28.6139,
        "longitude": 77.2090
    }
    ```


- `GET /dbStatus`

   _Checks if the database is connected and responsive._

    **Response:**
    ```json
    // If connected
    { "connected": true }

    // If connection failed
    { "connected": false, "error": "Error message" }
    ```
---

### Author
Made By [UditSaxena](https://github.com/UditSax3na)

---