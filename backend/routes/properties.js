const express = require('express');
const pool = require('../db.js');

const router = express.Router();

router.param('id', (req, res, next, id) => {
    if (id.length > 255){
        return res.status(400).json({error: "The ID you entered is oversized."});
    }
    if (!/^\d+$/.test(id)){
        return res.status(400).json({error: "The ID you entered is malformed."})
    }
    next();
});




router.get('/', async (req, res) => {
    const conditions = [];
    const values = [];

    // Parse parameters cleanly
    const limit = req.query.limit != null ? Number(req.query.limit) : 20;
    const offset = req.query.offset != null ? Number(req.query.offset) : 0;
    const city = req.query.city != null ? String(req.query.city).trim() : null;
    const zipcode = req.query.zipcode != null ? String(req.query.zipcode).trim() : null;
    const minPrice = req.query.minPrice != null ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice != null ? Number(req.query.maxPrice) : null;
    const beds = req.query.beds != null ? Number(req.query.beds) : null;
    const baths = req.query.baths != null ? Number(req.query.baths) : null;

    // 1. Validate Pagination
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        return res.status(400).json({ error: 'limit must be an integer between 1 and 100.' });
    }
    if (!Number.isInteger(offset) || offset < 0) {
        return res.status(400).json({ error: 'offset must be a nonnegative integer.' });
    }

    // 2. Validate Prices
    if (minPrice !== null && (!Number.isFinite(minPrice) || minPrice < 0)) {
        return res.status(400).json({ error: 'minPrice must be a nonnegative number.' });
    }
    if (maxPrice !== null && (!Number.isFinite(maxPrice) || maxPrice < 0)) {
        return res.status(400).json({ error: 'maxPrice must be a nonnegative number.' });
    }
    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
        return res.status(400).json({ error: 'minPrice cannot exceed maxPrice.' });
    }

    // 3. Validate Beds and Baths
    if (beds !== null && (!Number.isInteger(beds) || beds < 0)) {
        return res.status(400).json({ error: 'beds must be a nonnegative integer.' });
    }
    if (baths !== null && (!Number.isFinite(baths) || baths < 0)) {
        return res.status(400).json({ error: 'baths must be a nonnegative number.' });
    }

    try {
        // 4. Proper Database Validation for City Existence
        if (city !== null && city !== '') {
            const [existsResult] = await pool.query(
                'SELECT EXISTS(SELECT 1 FROM rets_property WHERE L_City = ?) AS cityExists',
                [city]
            );
            if (!existsResult[0].cityExists) {
                return res.status(400).json({ error: 'not a valid city.' });
            }
        }

        // 5. Proper Database Validation for Zipcode Format & Existence
        if (zipcode !== null && zipcode !== '') {
            if (!/^\d{5}$/.test(zipcode)) {
                return res.status(400).json({ error: 'not a valid zipcode. should be 5 digits.' });
            }
            const [existsResult] = await pool.query(
                'SELECT EXISTS(SELECT 1 FROM rets_property WHERE L_Zip = ?) AS zipExists',
                [zipcode]
            );
            if (!existsResult[0].zipExists) {
                return res.status(400).json({ error: 'zipcode does not exist in our listings.' });
            }
        }

        if (city) {
            conditions.push('L_City = ?');
            values.push(city);
        }
        if (zipcode) {
            conditions.push('L_Zip = ?');
            values.push(zipcode);
        }
        if (minPrice !== null) {
            conditions.push('L_SystemPrice >= ?');
            values.push(minPrice);
        }
        if (maxPrice !== null) {
            conditions.push('L_SystemPrice <= ?');
            values.push(maxPrice);
        }
        if (baths !== null) {
            conditions.push('LM_Dec_3 = ?');
            values.push(baths);
        }
        if (beds !== null) {
            conditions.push('L_Keyword2 = ?');
            values.push(beds);
        }

        const whereQuery = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ' ';

        // Execute queries with clean array mapping parameters
        const [response] = await pool.query(
            `SELECT * FROM rets_property ${whereQuery} ORDER BY id ASC LIMIT ? OFFSET ?`,
            [...values, limit, offset]
        );

        const [countRows] = await pool.query(
            `SELECT COUNT(*) AS total FROM rets_property ${whereQuery}`,
            values
        );

        res.json({
            total: countRows[0].total,
            message: 'Validation passed.',
            limit,
            offset,
            response,
        });
    } catch (dbError) {
        console.error("Execution Error:", dbError.message);
        res.status(500).json({ error: "Internal server database error." });
    }
});


router.get('/:id/openhouses', async(req, res) => {
    try{
        const [rows] = await pool.query(
                'SELECT * FROM rets_property WHERE L_ListingID = ?',
                [req.params.id]
        );
        if(rows.length <= 0){
            return res.status(404).json({error: `${req.params.id} is not a known ID.`});
        }
        const [openHouses] = await pool.query(
            'SELECT * FROM rets_openhouse WHERE L_ListingID = ? ORDER BY OpenHouseDate, OH_StartTime ASC;',
            [req.params.id]
        )
        res.json(openHouses);

    }catch (e){
        console.error("Execution Error:", e.message);
        return res.status(500).json({ error: "Internal server database error." });
    }
});

router.get('/:id', async(req, res) => {
    try{
        const [rows] = await pool.query(
                'SELECT * FROM rets_property WHERE L_ListingID = ?;',
                [req.params.id]
        );
        if(rows.length <= 0){
            return res.status(404).json({error: `${req.params.id} is not a known ID.`});
        }
        res.json(rows[0]);

    }catch (e){
        console.error("Execution Error:", e.message);
        return res.status(500).json({ error: "Internal server database error." });
    }
});

module.exports = router;
