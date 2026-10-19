export const validateName = (name) => {
  if (!name) return false;
  const trimmedName = name.trim();
  const nameRegex = /^[A-Za-zA-ÿ\s]{2,}$/;
  return nameRegex.test(trimmedName);
};

export const validatePhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateEmail = (email) => {
  if (!email) return false;
  // Regex exacta requerida
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (!password) return false;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password);
};