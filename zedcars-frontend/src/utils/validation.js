// Validation utility functions
export const validators = {
  required: (value) => !value?.toString().trim() ? "This field is required" : null,
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value && !emailRegex.test(value) ? "Invalid email format" : null;
  },
  
  phone: (value) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')) ? "Invalid phone number" : null;
  },
  
  password: (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return null;
  },
  
  price: (value) => {
    const num = parseFloat(value);
    return value && (isNaN(num) || num < 0) ? "Price must be a positive number" : null;
  },
  
  year: (value) => {
    const num = parseInt(value);
    const currentYear = new Date().getFullYear();
    return value && (isNaN(num) || num < 1900 || num > currentYear + 1) ? `Year must be between 1900 and ${currentYear + 1}` : null;
  },
  
  minLength: (min) => (value) => 
    value && value.length < min ? `Must be at least ${min} characters` : null,
  
  maxLength: (max) => (value) => 
    value && value.length > max ? `Must be no more than ${max} characters` : null
};

// Validate form data against rules
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    
    for (const rule of fieldRules) {
      const error = rule(data[field]);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return errors;
};
