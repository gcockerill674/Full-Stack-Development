const Joi = require('joi');
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'ThisIsRequired123',
    port: Number(process.env.DB_PORT) || 3306,
    database: 'registration-system',
    waitForConnections: true,
    connectionLimit: 10,
});

const facultySchema = Joi.object({
    "first-name": Joi.string().trim().min(1).max(255).required(),
    "last-name": Joi.string().trim().min(1).max(255).required(),
    "email": Joi.string().trim().min(1).max(255),
});

app.get('/', (req, res) => {
    res.send('Welcome to the registration API');
});

app.get('/api/faculty', async (req, res) => {
    try {
        const [faculty] = await pool.execute(
            'SELECT `ID` AS `ID`, `first-name`, `last-name`, email FROM faculty ORDER BY `ID`'
        );
        res.send(faculty);
    } catch (error) {
        console.error('Error selecting faculty:', error);
        res.status(500).send('An error occurred while selecting faculty.');
    }
});

app.get('/api/faculty/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).send('Student ID must be a positive integer.');
    }

    try {
        const [faculty] = await pool.execute(
            'SELECT `ID` AS `ID`, `first-name`, `last-name`, email FROM faculty WHERE `ID` = ?',
            [id]
        );
        if (faculty.length === 0) {
            return res.status(404).send('The faculty with the given ID was not found.');
        }
        res.send(faculty[0]);
    } catch (error) {
        console.error('Error selecting faculty:', error);
        res.status(500).send('An error occurred while selecting the faculty.');
    }
});

app.post('/api/faculty', async (req, res) => {
    const { error, value } = facultySchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO faculty (`first-name`, `last-name`, email) VALUES (?, ?, ?)',
            [value["first-name"], value["last-name"], value["email"]]
        );
        res.status(201).send({
            ID: result.insertId,
            "first-name": value["first-name"],
            "last-name": value["last-name"],
            "email": value["email"],
        });
    } catch (error) {
        console.error('Error inserting faculty:', error);
        res.status(500).send('An error occurred while inserting the faculty.');
    }
});

app.put('/api/faculty/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).send('Student ID must be a positive integer.');
    }

    const { error, value } = facultySchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        await pool.execute(
            'UPDATE faculty SET `first-name` = ?, `last-name` = ?, email = ? WHERE `ID` = ?',
            [value["first-name"], value["last-name"], value["email"], id]
        );
        const [faculty] = await pool.execute(
            'SELECT `ID` AS `ID`, `first-name`, `last-name`, email FROM faculty WHERE `ID` = ?',
            [id]
        );
        if (faculty.length === 0) {
            return res.status(404).send('The faculty with the given ID was not found.');
        }
        res.send(faculty[0]);
    } catch (error) {
        console.error('Error updating faculty:', error);
        res.status(500).send('An error occurred while updating the faculty.');
    }
});

app.delete('/api/faculty/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).send('Student ID must be a positive integer.');
    }

    try {
        const [result] = await pool.execute(
            'DELETE FROM faculty WHERE `ID` = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send('The faculty with the given ID was not found.');
        }
        res.send({ ID: id, message: 'Faculty deleted.' });
    } catch (error) {
        console.error('Error deleting faculty:', error);
        res.status(500).send('An error occurred while deleting the faculty.');
    }
});

app.listen(Number(process.env.PORT) || 3201, () => {
    console.log(`Server is running on port ${Number(process.env.PORT) || 3201}`);
});
