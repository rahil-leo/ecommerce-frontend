import { useState } from 'react';
import { Button, Input, Alert } from '@components/common';
import { API_BASE_URL } from '@constants';
import styles from './AddStaffForm.module.css';

const AddStaffForm = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/users/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send cookies for authentication
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Staff member added successfully!' });
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'staff',
          phone: ''
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to add staff member' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add staff member. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {message.text && (
        <Alert type={message.type}>{message.text}</Alert>
      )}

      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Enter staff name"
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="Enter email address"
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        placeholder="Enter password"
      />

      <Input
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Enter phone number"
      />

      <div className={styles.formGroup}>
        <label>Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className={styles.select}
        >
          <option value="staff">Product Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <Button type="submit" disabled={loading} fullWidth>
        {loading ? 'Adding Staff...' : 'Add Staff Member'}
      </Button>
    </form>
  );
};

export default AddStaffForm;
