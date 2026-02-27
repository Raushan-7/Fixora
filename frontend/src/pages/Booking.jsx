import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { services, timeSlots } from '../data/services';
import { apiAddBooking } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import '../styles/booking.css';

const Booking = () => {
    const { serviceId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Workers cannot book services — redirect them to their jobs page
    if (user?.userType === 'worker') {
        return <Navigate to="/worker-jobs" replace />;
    }

    const [selectedService, setSelectedService] = useState(serviceId || '');
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        address: '',
        notes: ''
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const service = services.find((s) => s.id === selectedService);

    useEffect(() => {
        if (serviceId) {
            setSelectedService(serviceId);
        }
    }, [serviceId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleServiceChange = (e) => {
        setSelectedService(e.target.value);
    };

    const handleTimeSelect = (time) => {
        setFormData({
            ...formData,
            time
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedService) {
            setError('Please select a service');
            return;
        }

        if (!formData.date || !formData.time || !formData.address) {
            setError('Please fill in all required fields');
            return;
        }

        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            setError('Please select a future date');
            return;
        }

        try {
            setLoading(true);
            await apiAddBooking({
                serviceId: selectedService,
                serviceName: service.name,
                date: formData.date,
                time: formData.time,
                address: formData.address,
                notes: formData.notes,
                price: service.priceRange,
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/my-bookings');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-page">
            <div className="container">
                <div className="booking-container">
                    <div className="booking-form">
                        <div className="booking-header">
                            <h2>Book a Service</h2>
                            <p>Fill in the details to schedule your service</p>
                        </div>

                        {success && (
                            <div className="success-message">
                                <span>✓</span>
                                <span>Booking confirmed! Redirecting to your bookings...</span>
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {service && (
                            <div className="booking-summary">
                                <h3>Selected Service</h3>
                                <div className="summary-item">
                                    <span className="summary-label">Service</span>
                                    <span className="summary-value">{service.name}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Price Range</span>
                                    <span className="summary-value">{service.priceRange}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Duration</span>
                                    <span className="summary-value">{service.duration}</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Select Service *</label>
                                <select
                                    className="form-select"
                                    value={selectedService}
                                    onChange={handleServiceChange}
                                    required
                                >
                                    <option value="">Choose a service</option>
                                    {services.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} - {s.priceRange}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Select Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="form-input"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Select Time Slot *</label>
                                <div className="time-slots">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            className={`time-slot ${formData.time === time ? 'selected' : ''}`}
                                            onClick={() => handleTimeSelect(time)}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Service Address *</label>
                                <textarea
                                    name="address"
                                    className="form-textarea"
                                    placeholder="Enter your complete address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Additional Notes (Optional)</label>
                                <textarea
                                    name="notes"
                                    className="form-textarea"
                                    placeholder="Any special instructions or requirements"
                                    value={formData.notes}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="booking-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Booking...' : 'Confirm Booking'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
