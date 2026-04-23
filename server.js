const express = require('express');
const cors = require('cors');
const db = require('./db'); // your separated DB file

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Countries API is running...');
});

app.get('/countries', (req, res) => {
    console.log("🔥 /countries route hit");

    db.query('SELECT * FROM countries', (err, results) => {
        if (err) {
            console.log("❌ DB error:", err);
            return res.status(500).json(err);
        }

        console.log("✅ Query success");
        res.json(results);
    });
});

app.get('/countries/:id', (req, res) => {
    db.query(
        'SELECT * FROM countries WHERE id = ?',
        [req.params.id],
        (err, results) => {
            if (err) return res.status(500).json(err);

            if (results.length === 0) {
                return res.status(404).json({ message: 'Country not found' });
            }

            res.json(results[0]);
        }
    );
});

app.post('/countries', (req, res) => {
    const { name, continent, president, capital_city, population, currency } = req.body;

    db.query(
        `INSERT INTO countries (name, continent, president, capital_city, population, currency)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, continent, president, capital_city, population, currency],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.status(201).json({
                message: 'Country created',
                id: result.insertId
            });
        }
    );
});

app.put('/countries/:id', (req, res) => {
    const { name, continent, president, capital_city, population, currency } = req.body;

    db.query(
        `UPDATE countries 
         SET name=?, continent=?, president=?, capital_city=?, population=?, currency=?
         WHERE id=?`,
        [name, continent, president, capital_city, population, currency, req.params.id],
        (err) => {
            if (err) return res.status(500).json(err);

            res.json({ message: 'Country updated successfully' });
        }
    );
});

app.delete('/countries/:id', (req, res) => {
    db.query(
        'DELETE FROM countries WHERE id=?',
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json(err);

            res.json({ message: 'Country deleted successfully' });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});