const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'books.json');

// Middleware
app.use(express.json());

// Initialize data file
const initializeData = async () => {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([
      { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
      { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" }
    ]));
  }
};

// GET all books
app.get('/books', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE);
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single book
app.get('/books/:id', async (req, res) => {
  try {
    const books = JSON.parse(await fs.readFile(DATA_FILE));
    const book = books.find(b => b.id === parseInt(req.params.id));
    
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new book
app.post('/books', async (req, res) => {
  try {
    const books = JSON.parse(await fs.readFile(DATA_FILE));
    const newBook = {
      id: books.length ? Math.max(...books.map(b => b.id)) + 1 : 1,
      ...req.body
    };
    
    books.push(newBook);
    await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2));
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Initialize and start server
initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
