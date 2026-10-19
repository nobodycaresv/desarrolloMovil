export const validateName = (name) => {
    if (!name) return false;
    const nameRegex = /^[A-Za-zÀ-ÿ\s]{2,}$/;
    return nameRegex.test(name);
};

export const validatePhone = (phone) => {
    if (!phone) return false;
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
};

export const validateEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    if (!password) return false;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
};