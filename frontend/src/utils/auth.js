export const getToken = () => {
    return localStorage.getItem('token');
};

export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const removeToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('darkMode');
    document.documentElement.classList.remove('dark-mode');
    window.dispatchEvent(new Event('userLogout'));
};

export const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const getAuthHeaders = () => {
    const token = getToken();
    return token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    } : {
        'Content-Type': 'application/json'
    };
};

export const logout = () => {
    removeToken();
    window.location.href = '/';
};
