const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');

const router = require('./routes/index');

// Слушаем 3000 порт
const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cookieParser);

// подключаемся к серверу mongo
mongoose.connect(DB_URL);

app.use(router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
