const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes/index');

// Слушаем 3000 порт
const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());
app.use(helmet());

// временно хардкодим автора карточки
app.use((req, res, next) => {
  req.user = {
    _id: '64ff70f35ec4c688e53bf2b7',
  };

  next();
});

// подключаемся к серверу mongo
mongoose.connect(DB_URL);

app.use(router);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
