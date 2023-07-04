const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  // Create a table to store TODO items
  db.run('CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, dueDate TEXT, priority TEXT)');

  // Add some dummy TODO items for testing
  db.run('INSERT INTO todos (description, dueDate, priority) VALUES (?, ?, ?)', ['Task 1', '2023-07-05', 'High']);
  db.run('INSERT INTO todos (description, dueDate, priority) VALUES (?, ?, ?)', ['Task 2', '2023-07-07', 'Medium']);
  db.run('INSERT INTO todos (description, dueDate, priority) VALUES (?, ?, ?)', ['Task 3', '2023-07-08', 'Low']);
  db.run('INSERT INTO todos (description, dueDate, priority) VALUES (?, ?, ?)', ['Task 4', '2023-07-05', 'High']);
  db.run('INSERT INTO todos (description, dueDate, priority) VALUES (?, ?, ?)', ['Task 5', '2023-07-07', 'Medium']);
  db.run('INSERT INTO todos (description, dueDate, priority) VALUES (?, ?, ?)', ['Task 6', '2023-07-08', 'Low']);
  db.run('INSERT INTO todos (description, dueDate, priority) VALUES (?, ?, ?)', ['Task 7', '2023-07-05', 'High']);
  db.run('INSERT INTO todos (description, dueDate, priority) VALUES (?, ?, ?)', ['Task 8', '2023-07-07', 'Medium']);
  db.run('INSERT INTO todos (description, dueDate, priority) VALUES (?, ?, ?)', ['Task 9', '2023-07-08', 'Low']);
  db.run('INSERT INTO todos (description, dueDate, priority) VALUES (?, ?, ?)', ['Task 10', '2023-07-05', 'High']);
  db.run('INSERT INTO todos (description, dueDate, priority) VALUES (?, ?, ?)', ['Task 11', '2023-07-07', 'Medium']);
  db.run('INSERT INTO todos (description, dueDate, priority) VALUES (?, ?, ?)', ['Task 12', '2023-07-08', 'Low']);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.get('/api/todos', (req, res) => {
  db.all('SELECT * FROM todos', [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
});

// Import required modules and initialize the SQLite database connection

// Define the route for inserting data
app.post('/api/todos', (req, res) => {
  console.log(req.body);
  const { description, dueDate, priority } = req.body;

  // Insert the data into the SQLite database
  db.run(
    'INSERT INTO todos (description, dueDate, priority) VALUES (?, ?, ?)',
    [description, dueDate, priority],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to insert data' });
      }
      return res.status(201).json({ message: 'Data inserted successfully' });
    }
  );
});

// Define the route for editing data
app.put('/api/todos/:id', (req, res) => {
  const id = req.params.id;
  const { description, dueDate, priority } = req.body;

  // Update the data in the SQLite database
  db.run(
    'UPDATE todos SET description = ?, dueDate = ?, priority = ? WHERE id = ?',
    [description, dueDate, priority, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update data' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Data not found' });
      }
      return res.status(200).json({ message: 'Data updated successfully' });
    }
  );
});

// Define the route for deleting data
app.delete('/api/todos/:id', (req, res) => {
  const id = req.params.id;

  // Delete the data from the SQLite database
  db.run('DELETE FROM todos WHERE id = ?', id, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete data' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Data not found' });
    }
    return res.status(200).json({ message: 'Data deleted successfully' });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
