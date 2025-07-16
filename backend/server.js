require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
