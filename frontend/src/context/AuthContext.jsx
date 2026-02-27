import { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiSignup, apiGetMe } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On app load, restore session using stored JWT token
        const token = localStorage.getItem('fixora_token');
        if (token) {
            apiGetMe()
                .then((userData) => setUser(userData))
                .catch(() => {
                    // Token is invalid or expired — clear it
                    localStorage.removeItem('fixora_token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const data = await apiLogin(email, password);
        localStorage.setItem('fixora_token', data.token);
        setUser(data.user);
        return data.user;
    };

    const signup = async (userData) => {
        const data = await apiSignup(userData);
        localStorage.setItem('fixora_token', data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('fixora_token');
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
