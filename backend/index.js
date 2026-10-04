const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());
var query = "SELECT 1;"

app.get('/health', async (req, res) => {
    try{
        const[rows] = await pool.query(query);
        res.status(200).json({ status: "ok", database: "connected" });
    }catch(err){
        console.error(err);
        res.status(500).json({error: '500 Database error'});
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});