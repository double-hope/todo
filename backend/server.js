import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import { corsCredentials } from './corsCredentials.js';

dotenv.config();

const app = express()
const port = process.env.PORT | 3000;

app.use(corsCredentials);

app.get('/', (req, res) => {
  try {
    const json = fs.readFileSync('todos.json', 'utf-8');

    const todos = JSON.parse(json);

    res.json(todos);
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/:id', (req, res) => {
  try {
    const todoId = req.params.id;
    const json = fs.readFileSync('todos.json', 'utf-8');
    const todos = JSON.parse(json);
    
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (todoToUpdate) {
      todoToUpdate.done = !todoToUpdate.done;
      fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2), 'utf-8');
      res.json(todos);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    console.error('Cannot change status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});