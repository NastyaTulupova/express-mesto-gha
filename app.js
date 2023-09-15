const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    req.user = {
      _id: '64ff70f35ec4c688e53bf2b7'
  };
  
    next();
  });

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(router);

//временно хардкодим автора карточки



app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
