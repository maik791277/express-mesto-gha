const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');

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
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  if (err instanceof mongoose.Error) {
    res.status(500).json({ message: 'Ошибка БД' });
  } else if (err.status === 404) {
    res.status(404).json({ message: 'Страница не найдена' });
  } else {
    res.status(err.status).json({ message: 'Произошла ошибка' });
  }
  next();
});

app.listen(PORT);
