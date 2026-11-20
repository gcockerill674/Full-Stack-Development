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

const studentSchema = Joi.object({
    "first-name": Joi.string().trim().min(1).max(255).required(),
    "last-name": Joi.string().trim().min(1).max(255).required(),
    "email": Joi.string().trim().min(1).max(255),
});

app.get('/', (req, res) => {
    res.send('Welcome to the registration API');
});

app.get('/api/students', async (req, res) => {
    try {
        const [students] = await pool.execute(
            'SELECT `ID` AS `ID`, `first-name`, `last-name`, email FROM students ORDER BY `ID`'
        );
        res.send(students);
    } catch (error) {
        console.error('Error selecting students:', error);
        res.status(500).send('An error occurred while selecting students.');
    }
});

app.get('/api/students/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).send('Student ID must be a positive integer.');
    }

    try {
        const [students] = await pool.execute(
            'SELECT `ID` AS `ID`, `first-name`, `last-name`, email FROM students WHERE `ID` = ?',
            [id]
        );
        if (students.length === 0) {
            return res.status(404).send('The student with the given ID was not found.');
        }
        res.send(students[0]);
    } catch (error) {
        console.error('Error selecting student:', error);
        res.status(500).send('An error occurred while selecting the student.');
    }
});

app.post('/api/students', async (req, res) => {
    const { error, value } = studentSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO students (`first-name`, `last-name`, email) VALUES (?, ?, ?)',
            [value["first-name"], value["last-name"], value["email"]]
        );
        res.status(201).send({
            ID: result.insertId,
            "first-name": value["first-name"],
            "last-name": value["last-name"],
            "email": value["email"],
        });
    } catch (error) {
        console.error('Error inserting student:', error);
        res.status(500).send('An error occurred while inserting the student.');
    }
});

app.put('/api/students/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).send('Student ID must be a positive integer.');
    }

    const { error, value } = studentSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        await pool.execute(
            'UPDATE students SET `first-name` = ?, `last-name` = ?, email = ? WHERE `ID` = ?',
            [value["first-name"], value["last-name"], value["email"], id]
        );
        const [students] = await pool.execute(
            'SELECT `ID` AS `ID`, `first-name`, `last-name`, email FROM students WHERE `ID` = ?',
            [id]
        );
        if (students.length === 0) {
            return res.status(404).send('The student with the given ID was not found.');
        }
        res.send(students[0]);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).send('An error occurred while updating the student.');
    }
});

app.delete('/api/students/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).send('Student ID must be a positive integer.');
    }

    try {
        const [result] = await pool.execute(
            'DELETE FROM students WHERE `ID` = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send('The student with the given ID was not found.');
        }
        res.send({ ID: id, message: 'Student deleted.' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('An error occurred while deleting the student.');
    }
});

app.listen(Number(process.env.PORT) || 3200, () => {
    console.log(`Server is running on port ${Number(process.env.PORT) || 3200}`);
});
