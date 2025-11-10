const express = require('express');
const jsonServer = require('json-server');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8081;

// Set up JSON Server middleware
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.use(middlewares);
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.status(200).json({ url: `/uploads/${req.file.filename}` });
});

app.post('/events', (req, res) => {
  const db = router.db;

  const { name, description, location, date, categoryId, image } = req.body;

  const newEvent = {
    id: String(Date.now()),
    name,
    description,
    location,
    date,
    categoryId,
    attendees: 0,
    favorites: 0,
    averageRating: 0,
    image: image || null
  };

  db.get('events').push(newEvent).write();

  res.status(201).json(newEvent);
});

const getCategoryNameById = (id, db) => {
  const category = db.get('categories').find({ id }).value();
  return category ? category.name : null;
};

app.post('/events/:id/ratings', (req, res) => {
  const db = router.db;
  const eventId = req.params.id;
  const { rating } = req.body;

  const newRating = {
    id: String(Date.now()),
    eventId,
    rating: parseInt(rating),
    date: new Date().toISOString()
  };

  db.get('ratings').push(newRating).write();

  const allRatings = db.get('ratings').filter({ eventId }).value();
  const average = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
  
  db.get('events')
    .find({ id: eventId })
    .assign({ averageRating: parseFloat(average.toFixed(1)) })
    .write();

  res.status(201).json(newRating);
});

app.post('/events/:id/attendees', (req, res) => {
  const db = router.db;
  const eventId = req.params.id;
  
  const event = db.get('events').find({ id: eventId }).value();
  
  db.get('events')
    .find({ id: eventId })
    .assign({ attendees: event.attendees + 1 })
    .write();

  res.status(200).json({ attendees: event.attendees });
});

app.post('/events/:id/favorites', (req, res) => {
  const db = router.db;
  const eventId = req.params.id;
  
  const event = db.get('events').find({ id: eventId }).value();
  
  db.get('events')
    .find({ id: eventId })
    .assign({ favorites: event.favorites + 1 })
    .write();

  res.status(200).json({ favorites: event.favorites });
});


app.use('/', router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
