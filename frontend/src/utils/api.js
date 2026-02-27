

const BASE_URL = import.meta.env.VITE_API_BASE_URL ||'/api';

const getToken = () => localStorage.getItem('fixora_token');

const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
});


const request = async (url, options = {}) => {
    const res = await fetch(`${BASE_URL}${url}`, options);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};



export const apiSignup = (userData) =>
    request('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

export const apiLogin = (email, password) =>
    request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

export const apiGetMe = () =>
    request('/auth/me', {
        method: 'GET',
        headers: authHeaders(),
    });


export const apiGetBookings = () =>
    request('/bookings', {
        method: 'GET',
        headers: authHeaders(),
    });

export const apiAddBooking = (bookingData) =>
    request('/bookings', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(bookingData),
    });

export const apiCancelBooking = (bookingId) =>
    request(`/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: authHeaders(),
    });

export const apiGetAvailableJobs = () =>
    request('/bookings/available', {
        method: 'GET',
        headers: authHeaders(),
    });

export const apiAcceptJob = (bookingId) =>
    request(`/bookings/${bookingId}/accept`, {
        method: 'PATCH',
        headers: authHeaders(),
    });

export const apiCompleteJob = (bookingId) =>
    request(`/bookings/${bookingId}/complete`, {
        method: 'PATCH',
        headers: authHeaders(),
    });


export const apiSendContact = (formData) =>
    request('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });
