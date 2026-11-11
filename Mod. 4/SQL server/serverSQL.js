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
    database: 'customers',
    waitForConnections: true,
    connectionLimit: 10,
});

const customerSchema = Joi.object({
    name: Joi.string().trim().min(1).max(255).required(),
    address: Joi.string().trim().min(1).max(255).required(),
});

app.get('/', (req, res) => {
    res.send('Welcome to the customers API');
});

app.get('/api/customers', async (req, res) => {
    try {
        const [customers] = await pool.execute(
            'SELECT id, name, address FROM customers ORDER BY id'
        );
        res.send(customers);
    } catch (error) {
        console.error('Error selecting customers:', error);
        res.status(500).send('An error occurred while selecting customers.');
    }
});

app.get('/api/customers/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).send('Customer ID must be a positive integer.');
    }

    try {
        const [customers] = await pool.execute(
            'SELECT id, name, address FROM customers WHERE id = ?',
            [id]
        );
        if (customers.length === 0) {
            return res.status(404).send('The customer with the given ID was not found.');
        }
        res.send(customers[0]);
    } catch (error) {
        console.error('Error selecting customer:', error);
        res.status(500).send('An error occurred while selecting the customer.');
    }
});

app.post('/api/customers', async (req, res) => {
    const { error, value } = customerSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO customers (name, address) VALUES (?, ?)',
            [value.name, value.address]
        );
        res.status(201).send({
            id: result.insertId,
            name: value.name,
            address: value.address,
        });
    } catch (error) {
        console.error('Error inserting customer:', error);
        res.status(500).send('An error occurred while inserting the customer.');
    }
});

app.put('/api/customers/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).send('Customer ID must be a positive integer.');
    }

    const { error, value } = customerSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        await pool.execute(
            'UPDATE customers SET name = ?, address = ? WHERE id = ?',
            [value.name, value.address, id]
        );
        const [customers] = await pool.execute(
            'SELECT id, name, address FROM customers WHERE id = ?',
            [id]
        );
        if (customers.length === 0) {
            return res.status(404).send('The customer with the given ID was not found.');
        }
        res.send(customers[0]);
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).send('An error occurred while updating the customer.');
    }
});

app.delete('/api/customers/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).send('Customer ID must be a positive integer.');
    }

    try {
        const [result] = await pool.execute(
            'DELETE FROM customers WHERE id = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send('The customer with the given ID was not found.');
        }
        res.send({ id, message: 'Customer deleted.' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).send('An error occurred while deleting the customer.');
    }
});

app.listen(Number(process.env.PORT) || 3000, () => {
    console.log(`Server is running on port ${Number(process.env.PORT) || 3000}`);
});