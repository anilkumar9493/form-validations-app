import { useState } from "react"
import './App.css'

const App = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateField = (name, value, currentFormData) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 3) return 'Name must be at least 3 characters'
        return ''

      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Enter a valid email address'
        }
        return ''

      case 'password':
        if (!value.trim()) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        return ''

      case 'confirmPassword':
        if (!value.trim()) return 'Confirm Password is required'
        if (value !== currentFormData.password) return 'Passwords do not match'
        return ''

      default:
        return ''
    }
  }

  const getPasswordStrength = (password) => {
    if (!password) return ''
    if (password.length < 6) return 'Weak'
    if (
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password)
    ) {
      return 'Strong'
    }
    return 'Medium'
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    const updatedFormData = {
      ...formData,
      [name]: value,
    }

    setFormData(updatedFormData)
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, updatedFormData),
      ...(name === 'password' && updatedFormData.confirmPassword
        ? {
          confirmPassword: validateField(
            'confirmPassword',
            updatedFormData.confirmPassword,
            updatedFormData
          ),
        }
        : {}),
    }))

    setSuccessMessage('')
  }

  const validateForm = () => {
    const newErrors = {}

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field], formData)
      if (error) {
        newErrors[field] = error
      }
    })
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSuccessMessage('')
    } else {
      setErrors({})
      setSuccessMessage('Form submitted successfully!')
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
    }

  }
  const passwordStrength = getPasswordStrength(formData.password)
  return (
    <div className="app">
      <div className="form-card">
        <h1>Registration Form</h1>
        <p className="subtitle">React form validation practice project</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-box">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {formData.password && (
              <p
                className={`strength ${passwordStrength === 'Weak'
                  ? 'weak'
                  : passwordStrength === 'Medium'
                    ? 'medium'
                    : 'strong'
                  }`}
              >
                Password Strength: {passwordStrength}
              </p>
            )}
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-box">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>

          {successMessage && <p className="success">{successMessage}</p>}
        </form>
      </div>
    </div>
  )
}
export default App