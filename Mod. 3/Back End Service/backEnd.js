const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: 'Course 1', building: 'Lied', room: '248' },
  { id: 2, name: 'Course 2', building: 'Lied', room: '249' },
  { id: 3, name: 'Course 3', building: 'Lied', room: '250' },
  { id: 4, name: 'Course 4', building: 'Lied', room: '251' },
]
let nextId = courses.length + 1;

app.get('/', (req, res) => {
  res.send('Welcome to the course API');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not found.');
  res.send(course);
});

app.post ('/api/courses', (req, res) => {

  const { error } = validateCourse(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: nextId++,
    name: req.body.name,
    building: req.body.building,
    room: req.body.room
  }
  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not found.');

  const { error } = validateCourse(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  course.building = req.body.building;
  course.room = req.body.room;

  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    building: Joi.string().required(),
    room: Joi.string().required()
  });
  return schema.validate(course);
}

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not found.');
  courses.splice(courses.indexOf(course), 1);
  res.send(course);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});