const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const downloadRoutes = require('./routes/download');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/payment', paymentRoutes);
app.use('/download', downloadRoutes);

mongoose.connect('mongodb://localhost:27017/mydb')
  .then(() => console.log('DB connected'))
  .catch(err => console.log(err));

app.listen(3000, () => console.log('Server running on port 3000'));
