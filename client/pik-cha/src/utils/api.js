const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // ... rest of your api configuration
}; 