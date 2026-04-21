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

  const [touched, setTouched] = useState({})

  const handleBlur = (e) => {
    const { name, value } = e.target

    setTouched((prev) => ({
      ...prev,
      [name]: value
    }))
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, formData)

    }))
  }

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

    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})

    setTouched(allTouched)

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
              onBlur={handleBlur}
              className={touched.name && errors.name ? 'input-error' : ''}
              aria-invalid={touched.name && errors.name ? 'true' : 'false'}
              aria-errormessage={touched.name && errors.name ? 'name-error' : undefined}
            />
            {touched.name && errors.name && (
              <p id="name-error" className="error-message" role="alert">
                <span className="error-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
                    <path
                      d="M12 7v6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
                  </svg>
                </span>
                <span>{errors.name}</span>
              </p>
            )}
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
              onBlur={handleBlur}
              className={touched.email && errors.email ? 'input-error' : ''}
              aria-invalid={touched.email && errors.email ? 'true' : 'false'}
              aria-errormessage={touched.email && errors.email ? 'email-error' : undefined}
            />
            {touched.email && errors.email && (
              <p id="email-error" className="error-message" role="alert">
                <span className="error-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
                    <path
                      d="M12 7v6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
                  </svg>
                </span>
                <span>{errors.email}</span>
              </p>
            )}
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
                onBlur={handleBlur}
                className={touched.password && errors.password ? 'input-error' : ''}
                aria-invalid={touched.password && errors.password ? 'true' : 'false'}
                aria-errormessage={touched.password && errors.password ? 'password-error' : undefined}
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
            {touched.password && errors.password && (
              <p id="password-error" className="error-message" role="alert">
                <span className="error-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
                    <path
                      d="M12 7v6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
                  </svg>
                </span>
                <span>{errors.password}</span>
              </p>
            )}
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
                onBlur={handleBlur}
                className={touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}
                aria-invalid={touched.confirmPassword && errors.confirmPassword ? 'true' : 'false'}
                aria-errormessage={touched.confirmPassword && errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p id="confirmPassword-error" className="error-message" role="alert">
                <span className="error-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
                    <path
                      d="M12 7v6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
                  </svg>
                </span>
                <span>{errors.confirmPassword}</span>
              </p>
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