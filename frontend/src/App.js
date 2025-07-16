import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error(err);
        toast.error('Error fetching products');
      });
  };

  const openModal = (product = null) => {
    if (product) {
      setEditProductId(product.id);
      setName(product.name);
      setPrice(product.price);
    } else {
      setEditProductId(null);
      setName('');
      setPrice('');
      setImage(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setName('');
    setPrice('');
    setImage(null);
    setEditProductId(null);
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = null;
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    if (!name || !price) {
      toast.error('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }

    if (editProductId) {
      // Update
      axios.put(`/api/products/${editProductId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(() => {
        toast.success('Product updated successfully');
        fetchProducts();
        closeModal();
      })
      .catch(err => {
        console.error(err);
        toast.error('Error updating product');
      });
    } else {
      // Create
      axios.post('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(() => {
        toast.success('Product added successfully');
        fetchProducts();
        closeModal();
      })
      .catch(err => {
        console.error(err);
        toast.error('Error adding product');
      });
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios.delete(`/api/products/${id}`)
        .then(() => {
          toast.success('Product deleted successfully');
          fetchProducts();
        })
        .catch(err => {
          console.error(err);
          toast.error('Error deleting product');
        });
    }
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Simple E-commerce Store 🛒</h1>

      <button className="add-btn" onClick={() => openModal()}>
        ➕ Add Product
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editProductId ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSaveProduct}>
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <input
                type="file"
                id="fileInput"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
              />
              <div className="modal-actions">
                <button type="submit">
                  {editProductId ? 'Update' : 'Add'}
                </button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h2>Product Listing</h2>
      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <img
              src={`http://localhost:5000${p.image_url}`}
              alt={p.name}
            />
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <div className="card-actions">
              <button onClick={() => openModal(p)}>✏️ Edit</button>
              <button onClick={() => handleDeleteProduct(p.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
