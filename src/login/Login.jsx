import React, { useState } from 'react';
import './Login.css';

function Login({ onNavigate, role }) {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.emailOrUsername) newErrors.emailOrUsername = 'Email or Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log('Login submitted:', { ...formData, role });
      // Logic for actual login would go here, using the role
    }
  };

  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <div className="logo-box"></div>
            <h2>SpendWise</h2>
          </div>
          <p className="welcome-text">Welcome back {displayRole}! Please login to your account.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="emailOrUsername">Email or Username</label>
            <input
              type="text"
              id="emailOrUsername"
              name="emailOrUsername"
              placeholder="Enter your email or username"
              value={formData.emailOrUsername}
              onChange={handleChange}
              className={errors.emailOrUsername ? 'error-input' : ''}
            />
            {errors.emailOrUsername && <span className="error-message">{errors.emailOrUsername}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error-input' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <button className="link-btn" onClick={() => onNavigate('signup')}>Sign up</button></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
