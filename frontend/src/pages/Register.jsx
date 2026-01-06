import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    employer_name: '',
    logo: null
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    if (e.target.name === 'logo') {
      setFormData({ ...formData, logo: e.target.files[0] });
      // Clear logo error when file is selected
      if (fieldErrors.logo) {
        const newFieldErrors = { ...fieldErrors };
        delete newFieldErrors.logo;
        setFieldErrors(newFieldErrors);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      // Clear field error when user starts typing
      if (fieldErrors[e.target.name]) {
        const newFieldErrors = { ...fieldErrors };
        delete newFieldErrors[e.target.name];
        setFieldErrors(newFieldErrors);
      }
      // Clear general error when user modifies email field
      if (error && e.target.name === 'email') {
        setError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Trim and validate email
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      setFieldErrors({ email: 'Email is required' });
      setError('Please fix the errors below');
      return;
    }
    
    if (!validateEmail(trimmedEmail)) {
      setFieldErrors({ email: 'Please enter a valid email address' });
      setError('Please fix the errors below');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setFieldErrors({ password_confirmation: 'Passwords do not match' });
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setFieldErrors({ password: 'Password must be at least 8 characters' });
      setError('Password must be at least 8 characters');
      return;
    }

    if (!formData.logo) {
      setFieldErrors({ logo: 'Logo is required' });
      setError('Logo is required');
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('email', trimmedEmail);
    data.append('password', formData.password);
    data.append('employer_name', formData.employer_name.trim());
    data.append('logo', formData.logo);

    const result = await register(data);
    
    if (result.success) {
      navigate('/jobs');
    } else {
      const errorMessage = result.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      
      // Set field-specific errors
      const newFieldErrors = {};
      if (errorMessage.toLowerCase().includes('email')) {
        newFieldErrors.email = errorMessage;
      }
      if (errorMessage.toLowerCase().includes('password')) {
        newFieldErrors.password = errorMessage;
      }
      if (errorMessage.toLowerCase().includes('logo')) {
        newFieldErrors.logo = errorMessage;
      }
      if (Object.keys(newFieldErrors).length > 0) {
        setFieldErrors(newFieldErrors);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900 text-red-200 p-3 rounded">
            {error}
            {error.toLowerCase().includes('email already registered') && (
              <div className="mt-2 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-300 hover:text-blue-200 underline">
                  Login here
                </Link>
              </div>
            )}
          </div>
        )}
        <div>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white focus:outline-none focus:border-blue-700"
          />
        </div>
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 bg-gray-900 border rounded text-white focus:outline-none focus:border-blue-700 ${
              fieldErrors.email 
                ? 'border-yellow-500 bg-yellow-900/20' 
                : 'border-gray-800'
            }`}
          />
          {fieldErrors.email && (
            <div className="mt-1">
              <p className="text-yellow-400 text-sm">{fieldErrors.email}</p>
              {fieldErrors.email.toLowerCase().includes('already registered') && (
                <Link to="/login" className="text-blue-400 hover:text-blue-300 text-sm underline">
                  Login instead
                </Link>
              )}
            </div>
          )}
        </div>
        <div>
          <label className="block mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className={`w-full px-4 py-2 bg-gray-900 border rounded text-white focus:outline-none focus:border-blue-700 ${
              fieldErrors.password 
                ? 'border-yellow-500 bg-yellow-900/20' 
                : 'border-gray-800'
            }`}
          />
          {fieldErrors.password && (
            <p className="text-yellow-400 text-sm mt-1">{fieldErrors.password}</p>
          )}
        </div>
        <div>
          <label className="block mb-2">Confirm Password</label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            minLength={8}
            className={`w-full px-4 py-2 bg-gray-900 border rounded text-white focus:outline-none focus:border-blue-700 ${
              fieldErrors.password_confirmation 
                ? 'border-yellow-500 bg-yellow-900/20' 
                : 'border-gray-800'
            }`}
          />
          {fieldErrors.password_confirmation && (
            <p className="text-yellow-400 text-sm mt-1">{fieldErrors.password_confirmation}</p>
          )}
        </div>
        <div>
          <label className="block mb-2">Employer Name</label>
          <input
            type="text"
            name="employer_name"
            value={formData.employer_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white focus:outline-none focus:border-blue-700"
          />
        </div>
        <div>
          <label className="block mb-2">Logo (PNG, JPG, JPEG, WEBP, SVG)</label>
          <input
            type="file"
            name="logo"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 bg-gray-900 border rounded text-white focus:outline-none focus:border-blue-700 ${
              fieldErrors.logo 
                ? 'border-yellow-500 bg-yellow-900/20' 
                : 'border-gray-800'
            }`}
          />
          {fieldErrors.logo && (
            <p className="text-yellow-400 text-sm mt-1">{fieldErrors.logo}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-800 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

