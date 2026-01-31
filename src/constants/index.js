// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const API_TIMEOUT = 10000;

// App Configuration
export const APP_NAME = 'Ecommerce Store';
export const ITEMS_PER_PAGE = 12;
export const MAX_CART_ITEMS = 99;

// Routes
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  STAFF_LOGIN: '/login/staff',
  ADMIN_LOGIN: '/admin/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ORDERS: '/orders',
  ABOUT: '/about',
  CONTACT: '/contact',
  ADMIN_DASHBOARD: '/admin/dashboard',
  STAFF_DASHBOARD: '/staff/dashboard',
  ADMIN_ADD_PRODUCT: '/admin/add-product',
  ADMIN_ADD_STAFF: '/admin/add-staff',
  ADMIN_STAFF_DETAILS: '/admin/staff-details',
};

// Product Categories
export const CATEGORIES = [
  { id: 'all', name: 'All Products', slug: 'all' },
  { id: 'electronics', name: 'Electronics', slug: 'electronics' },
  { id: 'jewelery', name: 'Jewelery', slug: 'jewelery' },
  { id: "men's clothing", name: "Men's Clothing", slug: 'mens-clothing' },
  { id: "women's clothing", name: "Women's Clothing", slug: 'womens-clothing' },
];

// Sort Options
export const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
];

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  CART_ITEMS: 'cart_items',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Please login to continue.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};
