import { useState } from 'react';
import { apiSendContact } from '../utils/api';
import '../styles/contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            await apiSendContact(formData);
            setSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });

            setTimeout(() => {
                setSuccess(false);
            }, 5000);
        } catch (err) {
            setError('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page">
            <div className="container">
                <div className="contact-container">
                    <div className="contact-header">
                        <h1>Get in Touch</h1>
                        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                    </div>

                    <div className="contact-grid">
                        <div className="contact-form-section">
                            <h2>Send us a Message</h2>

                            {success && (
                                <div className="success-message">
                                    <span>✓</span>
                                    <span>Message sent successfully! We'll get back to you soon.</span>
                                </div>
                            )}

                            {error && (
                                <div className="error-message">
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        placeholder="Enter your name"
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
                                    <label className="form-label">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        className="form-input"
                                        placeholder="What is this about?"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Message</label>
                                    <textarea
                                        name="message"
                                        className="form-textarea"
                                        placeholder="Write your message here..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>

                        <div className="contact-info-section">
                            <div className="contact-info-card">
                                <div className="contact-info-icon">📧</div>
                                <h3>Email Us</h3>
                                <p>
                                    <a href="mailto:support@fixora2.com">supportfixora2@gmail.com</a>
                                </p>
                                <p style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-sm)' }}>
                                    We'll respond within 24 hours
                                </p>
                            </div>

                            <div className="contact-info-card">
                                <div className="contact-info-icon">📞</div>
                                <h3>Call Us</h3>
                                <p>
                                    <a href="tel:+919876543210">+91 98765 43210</a>
                                </p>
                                <p style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-sm)' }}>
                                    Mon-Sat: 9:00 AM - 8:00 PM
                                </p>
                            </div>

                            <div className="contact-info-card">
                                <div className="contact-info-icon">📍</div>
                                <h3>Visit Us</h3>
                                <p>123 Service Street</p>
                                <p>Mumbai, Maharashtra 400001</p>
                                <p>India</p>
                            </div>

                            <div className="contact-social">
                                <h3>Follow Us</h3>
                                <div className="social-links">
                                    <a href="#" className="social-link" aria-label="Facebook">f</a>
                                    <a href="#" className="social-link" aria-label="Twitter">𝕏</a>
                                    <a href="#" className="social-link" aria-label="Instagram">📷</a>
                                    <a href="#" className="social-link" aria-label="LinkedIn">in</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
