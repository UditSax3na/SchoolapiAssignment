require('dotenv').config();
const express = require('express');
const db = require('./db');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")))

const PORT = process.env.PORT || 3000;


// Validation functions for string and float
function isValidString(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

function isValidFloat(value) {
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num);
}

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Haversine formula for sorting by proximity
app.get('/listSchools', async (req, res) => {
    const userLat = parseFloat(req.query.latitude ?? req.query.lat);
    const userLng = parseFloat(req.query.longitude ?? req.query.lng);

    
    if (userLat == null || userLng == null) {
        return res.status(400).json({ error: 'Latitude and longitude are required as query parameters.' });
    }

    if (!isValidFloat(userLat) || !isValidFloat(userLng)) {
        return res.status(400).json({ error: 'Latitude and longitude must be valid float numbers.' });
    }


    const sql = `
    SELECT *, (
    6371 * 2 * ASIN(SQRT(
        POWER(SIN(RADIANS(latitude - ?) / 2), 2) +
        COS(RADIANS(?)) * COS(RADIANS(latitude)) *
        POWER(SIN(RADIANS(longitude - ?) / 2), 2)
    ))
    ) AS distance
    FROM school_table
    ORDER BY distance ASC;
    `;

    const params = [userLat, userLat, userLng];

    
    db.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});


app.get('/dbStatus', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Ping DB failed:', err.message);
            return res.status(500).json({ connected: false, error: err.message });
        }

        console.log('Pinged DB successfully');
        connection.release();
        return res.json({ connected: true });
    });
});

app.post('/addSchool', async (req, res)=>{
    const { name, address, latitude, longitude } = await req.body;
    if ( !name || !address || !latitude || !longitude ) {
        // console.log("")
        return res.status(400).json({error: "Some parameter is missing, Check the parameters list again"})
    }
    if (!isValidString(name) || !isValidString(address)) {
        return res.status(400).json({error:"Invalid string input"});
    }

    if (!isValidFloat(latitude) || !isValidFloat(longitude)) {
        return res.status(400).json({error:"Invalid float input"});
    }

    const sql = `INSERT INTO school_table(name, address, latitude, longitude) VALUES (?, ?, ?, ?)`
    const values = [name, address, latitude, longitude]
    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ success: true, insertId: result.insertId });
    });
})
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
