const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useUnifiedTopology: true });

app.use((req, res, next) => {
  req.user = {
    _id: '649ef313c28175064a1f4c59',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT);
