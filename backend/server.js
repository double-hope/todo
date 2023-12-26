import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import { corsCredentials } from './corsCredentials.js';

dotenv.config();

const app = express()
const port = process.env.PORT | 3000;

app.use(express.json());
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

app.post('/', (req, res) => {
  try {
    const json = fs.readFileSync('todos.json', 'utf-8');
    const todos = JSON.parse(json);

    const newTodo = {
      id: generateUniqueId(),
      text: req.body.name,
      done: false,
      endDate: req.body.endDate
    };

    todos.push(newTodo);
    fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2), 'utf-8');
    res.json(todos);
  } catch (error) {
    console.error('Cannot add todo:', error);
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
      if (req.body.name) {
        todoToUpdate.name = req.body.name;
      }

      if (req.body.endDate) {
        todoToUpdate.endDate = req.body.endDate;
      }

      fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2), 'utf-8');
      res.json(todos);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    console.error('Cannot update todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/:id/status', (req, res) => {
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

app.delete('/:id', (req, res) => {
  try {
    const todoId = req.params.id;
    const json = fs.readFileSync('todos.json', 'utf-8');
    let todos = JSON.parse(json);

    const todoIndex = todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex !== -1) {
      todos.splice(todoIndex, 1);
      fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2), 'utf-8');
      res.json(todos);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    console.error('Cannot delete todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

function generateUniqueId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}