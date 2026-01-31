// Validation utilities

export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phone) {
    return 'Phone number is required';
  }
  if (!phoneRegex.test(phone)) {
    return 'Invalid phone number format';
  }
  if (phone.replace(/\D/g, '').length < 10) {
    return 'Phone number must be at least 10 digits';
  }
  return null;
};

export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

export const validateNumber = (value, fieldName = 'Field') => {
  if (isNaN(value)) {
    return `${fieldName} must be a number`;
  }
  return null;
};

export const validateMinValue = (value, minValue, fieldName = 'Field') => {
  if (parseFloat(value) < minValue) {
    return `${fieldName} must be at least ${minValue}`;
  }
  return null;
};

export const validateMaxValue = (value, maxValue, fieldName = 'Field') => {
  if (parseFloat(value) > maxValue) {
    return `${fieldName} must not exceed ${maxValue}`;
  }
  return null;
};

export const validateURL = (url) => {
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (!url) {
    return 'URL is required';
  }
  if (!urlRegex.test(url)) {
    return 'Invalid URL format';
  }
  return null;
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach((field) => {
    const rules = validationRules[field];
    const value = formData[field];
    
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
