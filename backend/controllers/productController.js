const pool = require('../db');

// CREATE product
exports.createProduct = async (req, res) => {
  const { name, price } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, price, image_url) VALUES (?, ?, ?)',
      [name, price, image_url]
    );
    res.json({ message: 'Product created', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

// GET all products
exports.getAllProducts = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM products');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

// UPDATE product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  let sql = 'UPDATE products SET name = ?, price = ?';
  const params = [name, price];

  if (req.file) {
    sql += ', image_url = ?';
    params.push(`/uploads/${req.file.filename}`);
  }

  sql += ' WHERE id = ?';
  params.push(id);

  try {
    await pool.query(sql, params);
    res.json({ message: 'Product updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};
