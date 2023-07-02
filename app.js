const http2 = require('node:http2');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useUnifiedTopology: true });

app.use((req, res, next) => {
  req.user = {
    _id: '649ef313c28175064a1f4c59',
  };
  next();
});

app.use('/', routes);

app.use((req, res, next) => {
  const error = new Error('Страница не найдена');
  error.status = HTTP_STATUS_NOT_FOUND;
  next(error);
});

app.use((err, req, res, next) => {
  if (err instanceof mongoose.Error || err.name === 'MongoError' || err.name === 'ValidationError') {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Ошибка БД' });
  } else if (err.status) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Произошла ошибка' });
  }
  next();
});

app.listen(PORT);
