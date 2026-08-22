const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:4200',
  'http://ruidotattoo.de',
  'https://ruidotattoo.de',
  'http://www.ruidotattoo.de',
  'https://www.ruidotattoo.de'
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  allowedHeaders: ['Content-Type', 'x-admin-password']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const ADMIN_PASSWORD = 'worldpeace';

const adminAuth = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (password === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Routes

// CREATE
app.post('/api/content', adminAuth, upload.single('image'), (req, res) => {
  const { type, title, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl || null;

  if (!type) {
    return res.status(400).json({ error: 'Type is required' });
  }

  const sql = `INSERT INTO content (type, title, description, imageUrl) VALUES (?, ?, ?, ?)`;
  const params = [type, title, description, imageUrl];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      id: this.lastID,
      type,
      title,
      description,
      imageUrl
    });
  });
});

// READ ALL
app.get('/api/content', (req, res) => {
  const { type } = req.query;
  let sql = 'SELECT * FROM content';
  const params = [];

  if (type) {
    sql += ' WHERE type = ?';
    params.push(type);
  }

  sql += ' ORDER BY createdAt DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// READ ONE
app.get('/api/content/:id', (req, res) => {
  const sql = 'SELECT * FROM content WHERE id = ?';
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(row);
  });
});

// UPDATE
app.put('/api/content/:id', adminAuth, upload.single('image'), (req, res) => {
  const { type, title, description } = req.body;
  const id = req.params.id;

  // First, get the current content to check for existing image
  db.get('SELECT imageUrl FROM content WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Content not found' });

    let imageUrl = row.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      // Optionally delete old image file here
    } else if (req.body.imageUrl === null || req.body.imageUrl === 'null') {
      imageUrl = null;
    }

    const sql = `UPDATE content SET type = COALESCE(?, type), title = ?, description = ?, imageUrl = ? WHERE id = ?`;
    const params = [type, title, description, imageUrl, id];

    db.run(sql, params, function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Content updated successfully' });
    });
  });
});

// DELETE
app.delete('/api/content/:id', adminAuth, (req, res) => {
  const id = req.params.id;

  // Get imageUrl to delete the file
  db.get('SELECT imageUrl FROM content WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Content not found' });

    if (row.imageUrl) {
      const filePath = path.join(__dirname, row.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    db.run('DELETE FROM content WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Content deleted successfully', deletedID: id });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
