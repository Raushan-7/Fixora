import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        userType: 'customer'
    });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            await signup(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="container">
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="card">
                        <h2 className="text-center">Create Account</h2>
                        <p className="text-center text-secondary">Join Fixora  today</p>

                        {error && (
                            <div className="error-message">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-input"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input"
                                    placeholder="Create a password (min 6 characters)"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">I am a</label>
                                <select
                                    name="userType"
                                    className="form-select"
                                    value={formData.userType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="customer">Customer</option>
                                    <option value="worker">Worker</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                Create Account
                            </button>
                        </form>

                        <p className="text-center mt-2">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary" style={{ fontWeight: 600 }}>
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
