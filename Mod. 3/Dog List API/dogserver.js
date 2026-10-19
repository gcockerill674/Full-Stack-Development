const Joi = require('joi');
const express = require('express');
const path = require('path');
const app = express();

// Middleware to handle CORS for local development
app.use((req, res, next) => {
  const origin = req.get('Origin');
  const isLocalOrigin = origin === 'null'
    || /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(origin || '');

  if (origin && isLocalOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
// Middleware to parse JSON bodies
app.use(express.json());
// Mock data for dogs
const dogs = [
  { id: 1, name: 'Johnny', breed: 'Labrador', age: 4 },
  { id: 2, name: 'Buddy', breed: 'Golden Retriever', age: 2 },
  { id: 3, name: 'Max', breed: 'German Shepherd', age: 5 },
  { id: 4, name: 'Lucy', breed: 'Bulldog', age: 3 }
];
let nextId = dogs.length + 1;

// Route to serve the main HTML page
app.get('/', (req, res) => {
  res.send('Welcome to the Dog List API. Please try /api/population to see the list of dogs.');
});

// Route to serve the client-side JavaScript file
app.get('/dog.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'dog.js'));
});
// Route to serve the Bootstrap CSS file
app.get('/bootstrap.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'bootstrap.css'));
});
// Route to serve the API endpoint for dog population
app.get('/api/population', (req, res) => {
  res.send(dogs);
});
// Route to serve the API endpoint for a specific dog by ID
app.get('/api/population/:id', (req, res) => {
  const dog = dogs.find(d => d.id === parseInt(req.params.id, 10));
  if (!dog) return res.status(404).send('The dog with the given ID was not found.');
  res.send(dog);
});
// Route to handle adding a new dog to the population
app.post('/api/population', (req, res) => {
  const { error, value } = validateDog(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const dog = {
    id: nextId++,
    name: value.name,
    breed: value.breed,
    age: value.age
  };
  dogs.push(dog);
  res.status(201).send(dog);
});
// Route to handle updating an existing dog's information
app.put('/api/population/:id', (req, res) => {
  const dog = dogs.find(d => d.id === parseInt(req.params.id, 10));
  if (!dog) return res.status(404).send('The dog with the given ID was not found.');

  const { error, value } = validateDog(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  dog.name = value.name;
  dog.breed = value.breed;
  dog.age = value.age;

  res.send(dog);
});
// Function to validate the dog object using Joi schema
function validateDog(dog) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    breed: Joi.string().required(),
    age: Joi.number().integer().min(0).required()
  });
  return schema.validate(dog);
}
// Route to handle deleting a dog from the population by ID
app.delete('/api/population/:id', (req, res) => {
  const dog = dogs.find(d => d.id === parseInt(req.params.id, 10));
  if (!dog) return res.status(404).send('The dog with the given ID was not found.');
  dogs.splice(dogs.indexOf(dog), 1);
  res.send(dog);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});