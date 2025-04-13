const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const UserModel = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PostModel = require('./models/Post');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, 'Public/Images'))); // Middleware to serve images

mongoose.connect('mongodb://localhost:27017/blog');

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json('The token is missing');
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json("The token is wrong");
      } else {
        req.email = decoded.email;
        req.name = decoded.name;
        next();
      }
    });
  }
};

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Public/Images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
});

// Routes
app.get('/', verifyUser, (req, res) => {
  return res.json({ email: req.email, name: req.name });
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then(hash => {
      UserModel.create({ name, email, password: hash })
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json({ error: error.message }));
    }).catch(err => console.log(err));
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email })
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const token = jwt.sign({ email: user.email, name: user.name }, "jwt-secret-key", { expiresIn: '1d' });
            res.cookie('token', token);
            return res.json('Success');
          } else {
            return res.json("Password is incorrect");
          }
        });
      } else {
        res.json("User not exist");
      }
    });
});

app.post('/create', upload.single('file'), verifyUser, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `http://localhost:3001/images/${req.file.filename}`;

  PostModel.create({
    title: req.body.title,
    description: req.body.description,
    file: imageUrl
  })
    .then(result => res.json("Success"))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/getPosts', (req, res) => {
  PostModel.find()
    .then(posts => res.json(posts))
    .catch(err => res.json(err));
});

app.get('/getpostByid/:id', (req, res) => {
  const id = req.params.id;
  PostModel.findById(id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/editpost/:id', async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.json('Success');
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/deletepost/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deletedPost = await PostModel.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.json('Success');
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});




app.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json('Logout successful');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
