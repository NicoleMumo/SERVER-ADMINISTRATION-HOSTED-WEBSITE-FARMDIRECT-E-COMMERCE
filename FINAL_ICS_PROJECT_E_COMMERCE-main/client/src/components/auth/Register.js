import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Link,
  Paper
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CONSUMER', // default role
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation functions
  const validateName = (name) => {
    if (!name) {
      return 'Name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (name.trim().length > 50) {
      return 'Name must be less than 50 characters';
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) {
      return 'Phone number is required';
    }
    // Allow various phone formats (with/without country code, with/without dashes/spaces)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return 'Please enter a valid phone number';
    }
    // Remove non-digit characters for length check
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      return 'Phone number must contain at least 10 digits';
    }
    if (digitsOnly.length > 15) {
      return 'Phone number is too long';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    let error = '';
    if (name === 'name') {
      error = validateName(value);
    } else if (name === 'email') {
      error = validateEmail(value);
    } else if (name === 'phone') {
      error = validatePhone(value);
    } else if (name === 'password') {
      error = validatePassword(value);
      // Also re-validate confirm password if it's been touched
      if (touched.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          password: error,
          confirmPassword: validateConfirmPassword(formData.confirmPassword, value),
        }));
        return;
      }
    } else if (name === 'confirmPassword') {
      error = validateConfirmPassword(value, formData.password);
    }
    
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    
    // Real-time validation if field has been touched
    if (touched[name]) {
      let error = '';
      if (name === 'name') {
        error = validateName(value);
      } else if (name === 'email') {
        error = validateEmail(value);
      } else if (name === 'phone') {
        error = validatePhone(value);
      } else if (name === 'password') {
        error = validatePassword(value);
        // Also re-validate confirm password if it's been touched
        if (touched.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            password: error,
            confirmPassword: validateConfirmPassword(formData.confirmPassword, value),
          }));
          return;
        }
      } else if (name === 'confirmPassword') {
        error = validateConfirmPassword(value, formData.password);
      }
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
    };
    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });
    return !Object.values(newErrors).some((err) => err !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...dataToSend } = formData;
      const response = await axios.post('/api/auth/register', dataToSend);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#F9FBE7',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        sx={{ flexGrow: 1, p: 2 }}
      >
        {/* Left Section - Branding */}
        <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
              maxWidth: { xs: '100%', md: '80%' },
              mx: 'auto',
            }}
          >
            <CheckCircle sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 'bold', color: '#4CAF50', mb: 1 }}
            >
              FarmDirect
            </Typography>
            <Typography variant="h6" sx={{ color: '#212121' }}>
              Create your account
            </Typography>
          </Box>
        </Grid>

        {/* Right Section - Registration Form */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
              maxWidth: 450,
              mx: 'auto',
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{ mb: 3, color: '#4CAF50', fontWeight: 'bold' }}
            >
              Register
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: errors.name && touched.name ? '#d32f2f' : '#E0E0E0' },
                    '&:hover fieldset': { borderColor: errors.name && touched.name ? '#d32f2f' : '#4CAF50' },
                    '&.Mui-focused fieldset': { borderColor: errors.name && touched.name ? '#d32f2f' : '#4CAF50' },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && !!errors.phone}
                helperText={touched.phone ? errors.phone : 'Include country code (e.g., +254)'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: errors.phone && touched.phone ? '#d32f2f' : '#E0E0E0' },
                    '&:hover fieldset': { borderColor: errors.phone && touched.phone ? '#d32f2f' : '#4CAF50' },
                    '&.Mui-focused fieldset': { borderColor: errors.phone && touched.phone ? '#d32f2f' : '#4CAF50' },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: errors.email && touched.email ? '#d32f2f' : '#E0E0E0' },
                    '&:hover fieldset': { borderColor: errors.email && touched.email ? '#d32f2f' : '#4CAF50' },
                    '&.Mui-focused fieldset': { borderColor: errors.email && touched.email ? '#d32f2f' : '#4CAF50' },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && !!errors.password}
                helperText={touched.password ? errors.password : 'Min 8 chars, 1 uppercase, 1 lowercase, 1 number'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: errors.password && touched.password ? '#d32f2f' : '#E0E0E0' },
                    '&:hover fieldset': { borderColor: errors.password && touched.password ? '#d32f2f' : '#4CAF50' },
                    '&.Mui-focused fieldset': { borderColor: errors.password && touched.password ? '#d32f2f' : '#4CAF50' },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && !!errors.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: errors.confirmPassword && touched.confirmPassword ? '#d32f2f' : '#E0E0E0' },
                    '&:hover fieldset': { borderColor: errors.confirmPassword && touched.confirmPassword ? '#d32f2f' : '#4CAF50' },
                    '&.Mui-focused fieldset': { borderColor: errors.confirmPassword && touched.confirmPassword ? '#d32f2f' : '#4CAF50' },
                  },
                }}
              />
              <TextField
                select
                margin="normal"
                required
                fullWidth
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                SelectProps={{ native: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#E0E0E0' },
                    '&:hover fieldset': { borderColor: '#4CAF50' },
                    '&.Mui-focused fieldset': { borderColor: '#4CAF50' },
                  },
                }}
              >
                <option value="CONSUMER">Consumer</option>
                <option value="FARMER">Farmer</option>
                <option value="ADMIN">Admin</option>
              </TextField>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                disabled={loading}
                    sx={{
                  mt: 3,
                  mb: 2,
                      bgcolor: '#4CAF50',
                  '&:hover': { bgcolor: '#388E3C' },
                  '&.Mui-disabled': { bgcolor: '#A5D6A7' },
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Register'}
                  </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/login')}
                sx={{ color: '#0288D1' }}
              >
                Already have an account? Login
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register; 