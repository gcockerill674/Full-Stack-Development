const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const tasks = [
    { id: 1, description: 'Spanish Assignment', due: '2026-06-30', progress: 'incomplete' },
    { id: 2, description: 'Math Assignment', due: '2026-07-01', progress: 'complete' },
    { id: 3, description: 'Programming Assignment', due: '2026-09-16', progress: 'incomplete' },
    { id: 4, description: 'Meteorology Assignment', due: '2026-09-17', progress: 'complete' },
];

let nextId = tasks.length;

app.get('/', (req, res) => {
  res.send('Welcome to the to-do API');
  res.send('get /api/list to see the list of tasks');
  res.send('get /api/list/:id to see a specific task');
  res.send('post /api/list to add a new task');
  res.send('put /api/list/:id to update a task');
  res.send('delete /api/list/:id to delete a task');
});

app.get('/api/list', (req, res) => {
  res.send(tasks);
});

app.get('/api/list/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id, 10));
  if (!task) return res.status(404).send('The task with the given ID was not found.');
  res.send(task);
});

app.post('/api/list', (req, res) => {
  const { error, value } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const task = {
    id: nextId++,
    description: value.description,
    due: value.due,
    progress: value.progress
  };
  tasks.push(task);
  res.status(201).send(task);
});

app.put('/api/list/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id, 10));
  if (!task) return res.status(404).send('The task with the given ID was not found.');

  const { error, value } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  task.description = value.description;
  task.due = value.due;
  task.progress = value.progress;
  res.send(task);
});

function validateTask(task) {
  const schema = Joi.object({
    description: Joi.string().min(1).required(),
    due: Joi.date().iso().required(),
    progress: Joi.string().valid('complete', 'incomplete').required()
  });
  return schema.validate(task);
}

app.delete('/api/list/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id, 10));
  if (!task) return res.status(404).send('The task with the given ID was not found.');

  tasks.splice(tasks.indexOf(task), 1);
  res.send(task);
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});