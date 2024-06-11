const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

let users = [];

app.post('/users', upload.single('profilePicture'), (req, res) => {
  const { name, email, password } = req.body;
  const profilePicture = req.file ? req.file.path : null;
  const user = { id: Date.now(), name, email, password, profilePicture };
  users.push(user);
  res.status(201).json(user);
});

app.put('/users/:id', upload.single('profilePicture'), (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;
  const profilePicture = req.file ? req.file.path : null;

  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], name, email, profilePicture: profilePicture || users[userIndex].profilePicture };
    res.json(users[userIndex]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(user => user.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
