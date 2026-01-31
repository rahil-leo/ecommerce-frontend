import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Button, Input, Alert } from '@components/common';
import { API_BASE_URL } from '@constants';
import styles from './AddProduct.module.css';

const AddProduct = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
    imagePreview: '',
    brand: '',
    stock: ''
  });

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'admin' && user.role !== 'staff'))) {
      navigate('/login');
    } else if (!authLoading && user && (user.role === 'admin' || user.role === 'staff')) {
      fetchCategories();
      fetchProducts();
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      if (file) {
        setFormData({
          ...formData,
          image: file,
          imagePreview: URL.createObjectURL(file)
        });
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let imageUrl = formData.imagePreview;
      
      // Upload new image if selected
      if (formData.image && typeof formData.image !== 'string') {
        const imageFormData = new FormData();
        imageFormData.append('image', formData.image);

        const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          credentials: 'include', // Send cookies
          body: imageFormData
        });

        const uploadData = await uploadResponse.json();

        if (!uploadData.success) {
          setMessage({ type: 'error', text: 'Failed to upload image' });
          setLoading(false);
          return;
        }
        imageUrl = uploadData.data.url;
      } else if (!imageUrl && !editingProductId) {
        setMessage({ type: 'error', text: 'Please select an image' });
        setLoading(false);
        return;
      }

      // Prepare product data
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        images: [{ url: imageUrl, alt: formData.name }],
        brand: formData.brand,
        stock: Number(formData.stock),
        isActive: true
      };

      // Update or create product
      const url = editingProductId 
        ? `${API_BASE_URL}/products/${editingProductId}`
        : `${API_BASE_URL}/products`;
      
      const method = editingProductId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Send cookies
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: editingProductId ? 'Product updated successfully!' : 'Product added successfully!' 
        });
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          image: null,
          imagePreview: '',
          brand: '',
          stock: ''
        });
        setEditingProductId(null);
        fetchProducts();
        // Scroll to top to see success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include' // Send cookies
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Product deleted successfully!' });
        fetchProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete product' });
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category._id || product.category,
      image: product.images[0]?.url,
      imagePreview: product.images[0]?.url,
      brand: product.brand,
      stock: product.stock
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: null,
      imagePreview: '',
      brand: '',
      stock: ''
    });
    setMessage({ type: '', text: '' });
  };

  const handleBackToDashboard = () => {
    if (user.role === 'staff') {
      navigate('/staff/dashboard');
    } else if (user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className={styles.addProduct}>
      <div className="container">
        <div className={styles.header}>
          <Button variant="outline" onClick={handleBackToDashboard}>
            ← Back to Dashboard
          </Button>
          <h1 className={styles.title}>
            {editingProductId ? 'Edit Product' : 'Add Product'}
          </h1>
        </div>

        {message.text && (
          <Alert type={message.type}>{message.text}</Alert>
        )}

        <div className={styles.content}>
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
              />

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Enter product description"
                  rows="4"
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formRow}>
                <Input
                  label="Price ($)"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />

                <Input
                  label="Stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  placeholder="0"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  placeholder="Enter brand name"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Product Image *</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  required={!editingProductId}
                  className={styles.fileInput}
                />
                {formData.imagePreview && (
                  <div className={styles.imagePreview}>
                    <img src={formData.imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className={styles.buttonGroup}>
                <Button type="submit" disabled={loading} fullWidth>
                  {loading 
                    ? (editingProductId ? 'Updating...' : 'Adding...') 
                    : (editingProductId ? 'Update Product' : 'Add Product')
                  }
                </Button>
                {editingProductId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    fullWidth
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>

          <div className={styles.productsSection}>
            <h2 className={styles.sectionTitle}>All Products ({products.length})</h2>
            {products.length === 0 ? (
              <p className={styles.emptyMessage}>No products yet. Add your first product!</p>
            ) : (
              <div className={styles.productsList}>
                {products.map(product => (
                  <div key={product._id} className={styles.productCard}>
                    <img 
                      src={product.images[0]?.url} 
                      alt={product.name}
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <h3>{product.name}</h3>
                      <p className={styles.productPrice}>${product.price}</p>
                      <p className={styles.productStock}>Stock: {product.stock}</p>
                      <p className={styles.productCategory}>
                        {product.category?.name || 'No category'}
                      </p>
                      <div className={styles.productActions}>
                        <Button 
                          variant="primary" 
                          size="small"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="danger" 
                          size="small"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
