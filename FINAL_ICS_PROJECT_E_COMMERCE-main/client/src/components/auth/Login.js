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
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import { CheckCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //Input Validation functions
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

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    let error = '';
    if (name === 'email') {
      error = validateEmail(value);
    } else if (name === 'password') {
      error = validatePassword(value);
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
      if (name === 'email') {
        error = validateEmail(value);
      } else if (name === 'password') {
        error = validatePassword(value);
      }
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect based on role
      const role = response.data.user.role;
      if (role === 'FARMER') {
        navigate('/farmer/dashboard');
      } else if (role === 'CONSUMER') {
        navigate('/consumer/dashboard');
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/'); // fallback
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
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
              Welcome Back!
            </Typography>
          </Box>
        </Grid>

        {/* Right Section - Login Form */}
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
              Login
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
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: errors.password && touched.password ? '#d32f2f' : '#E0E0E0' },
                    '&:hover fieldset': { borderColor: errors.password && touched.password ? '#d32f2f' : '#4CAF50' },
                    '&.Mui-focused fieldset': { borderColor: errors.password && touched.password ? '#d32f2f' : '#4CAF50' },
                  },
                }}
              />
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
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/register')}
                sx={{ color: '#0288D1' }}
              >
                Don&apos;t have an account? Register
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login; 