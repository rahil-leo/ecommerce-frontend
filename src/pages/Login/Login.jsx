import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Input, Card } from '@components/common';
import { useAuth } from '@context/AuthContext';
import { authService } from '@services';
import { ROUTES } from '@constants';
import styles from './Login.module.css';

const Login = ({ isAdminLogin = false, isStaffLogin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Detect login type from route or props
  const isAdmin = isAdminLogin || location.pathname === ROUTES.ADMIN_LOGIN;
  const isStaff = isStaffLogin || location.pathname === ROUTES.STAFF_LOGIN;
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Use different endpoint for staff login
      let data;
      if (isStaff) {
        const response = await fetch('http://localhost:8000/api/auth/staff/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        data = await response.json();
      } else {
        data = await authService.login({
          email: formData.email,
          password: formData.password,
        });
      }

      if (data.success) {
        // Cookie is automatically set by browser
        login(data.user);
        
        // Redirect based on login type and role
        if (isStaff) {
          // Staff login page - redirect to staff dashboard
          navigate(ROUTES.STAFF_DASHBOARD);
        } else if (isAdmin) {
          // Admin login page - only allow admin users
          if (data.user.role === 'admin') {
            navigate(ROUTES.ADMIN_DASHBOARD);
          } else {
            setErrors({ general: 'Access denied. Admin credentials required.' });
            setLoading(false);
            return;
          }
        } else {
          // Regular user login - redirect based on role
          if (data.user.role === 'admin') {
            navigate(ROUTES.ADMIN_DASHBOARD);
          } else if (data.user.role === 'staff') {
            navigate(ROUTES.STAFF_DASHBOARD);
          } else {
            navigate(ROUTES.HOME);
          }
        }
      } else {
        setErrors({ general: data.message || 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className={styles.login}>
        <Card padding="large" className={styles.loginCard}>
          <h1 className={styles.title}>
            {isStaff ? 'Staff Login' : isAdmin ? 'Admin Login' : 'Login'}
          </h1>
          <p className={styles.subtitle}>
            {isStaff
              ? 'Welcome back! Please login with your staff credentials.'
              : isAdmin 
                ? 'Welcome back! Please login with your admin credentials.' 
                : 'Welcome back! Please login to your account.'
            }
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              required
            />

            {errors.general && (
              <div className={styles.error}>{errors.general}</div>
            )}

            <Button type="submit" fullWidth size="large" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <div className={styles.footer}>
              <p>
                Don't have an account?{' '}
                <a href={ROUTES.REGISTER} className={styles.link}>
                  Register here
                </a>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
