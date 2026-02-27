import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGetBookings, apiGetAvailableJobs } from '../utils/api';
import { services } from '../data/services';
import BookingCard from '../components/BookingCard';
import '../styles/dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [availableJobsCount, setAvailableJobsCount] = useState(0);

    const isWorker = user.userType === 'worker';

    const loadBookings = async () => {
        try {
            const data = await apiGetBookings();
            setBookings(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error('Failed to load bookings:', err.message);
        }
    };

    const loadAvailableCount = async () => {
        try {
            const data = await apiGetAvailableJobs();
            setAvailableJobsCount(data.length);
        } catch (err) {
            console.error('Failed to load available jobs count:', err.message);
        }
    };

    useEffect(() => {
        loadBookings();
        if (isWorker) loadAvailableCount();
    }, [user]);

    const recentBookings = bookings.slice(0, 3);
    const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed').length;
    const completedBookings = bookings.filter((b) => b.status === 'Completed').length;
    const pendingBookings = bookings.filter((b) => b.status === 'Pending').length;

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <h1>Welcome back, {user.name}! </h1>
                    <p>
                        {isWorker
                            ? 'Manage your assigned jobs and schedule'
                            : 'Manage your bookings and explore new services'}
                    </p>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-label">{isWorker ? 'Accepted Jobs' : 'Total Bookings'}</div>
                        <div className="stat-value">{bookings.length}</div>
                    </div>
                    {isWorker ? (
                        <>
                            <Link to="/worker-jobs" className="stat-card secondary" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                                <div className="stat-label">Available Jobs</div>
                                <div className="stat-value" style={{ color: availableJobsCount > 0 ? 'var(--secondary)' : undefined }}>
                                    {availableJobsCount}
                                </div>
                            </Link>
                            <div className="stat-card accent">
                                <div className="stat-label">Confirmed</div>
                                <div className="stat-value">{confirmedBookings}</div>
                            </div>
                            <div className="stat-card info">
                                <div className="stat-label">Completed</div>
                                <div className="stat-value">{completedBookings}</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="stat-card secondary">
                                <div className="stat-label">Pending</div>
                                <div className="stat-value">{pendingBookings}</div>
                            </div>
                            <div className="stat-card accent">
                                <div className="stat-label">Confirmed</div>
                                <div className="stat-value">{confirmedBookings}</div>
                            </div>
                            <div className="stat-card info">
                                <div className="stat-label">Completed</div>
                                <div className="stat-value">{completedBookings}</div>
                            </div>
                        </>
                    )}
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-section">
                        <h2>{isWorker ? 'Assigned Jobs' : 'Recent Bookings'}</h2>
                        {recentBookings.length > 0 ? (
                            <>
                                <div className="booking-list">
                                    {recentBookings.map((booking) => (
                                        <BookingCard key={booking._id} booking={booking} onUpdate={loadBookings} />
                                    ))}
                                </div>
                                <Link
                                    to="/my-bookings"
                                    className="btn btn-outline"
                                    style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                                >
                                    View All Bookings
                                </Link>
                            </>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">{isWorker ? '🔧' : '📋'}</div>
                                <h3>{isWorker ? 'No assigned jobs yet' : 'No bookings yet'}</h3>
                                <p>{isWorker ? 'Browse available jobs and accept one to get started' : 'Start by booking a service'}</p>
                                <Link
                                    to={isWorker ? '/worker-jobs' : '/services'}
                                    className="btn btn-primary"
                                    style={{ marginTop: 'var(--spacing-md)' }}
                                >
                                    {isWorker ? 'Browse Available Jobs' : 'Browse Services'}
                                </Link>
                            </div>
                        )}
                    </div>

                    <div>
                        {!isWorker && (
                            <div className="dashboard-section" style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <h2>Quick Book</h2>
                                <div className="quick-book">
                                    <h3>Book a Service</h3>
                                    <select
                                        className="form-select"
                                        value={selectedService}
                                        onChange={(e) => setSelectedService(e.target.value)}
                                    >
                                        <option value="">Select a service</option>
                                        {services.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.name}
                                            </option>
                                        ))}
                                    </select>
                                    <Link
                                        to={selectedService ? `/booking/${selectedService}` : '/booking'}
                                        className="btn btn-primary"
                                        style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                                    >
                                        Continue to Booking
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="dashboard-section">
                            <h2>Profile Information</h2>
                            <div className="profile-info">
                                <div className="profile-item">
                                    <span className="profile-label">Name</span>
                                    <span className="profile-value">{user.name}</span>
                                </div>
                                <div className="profile-item">
                                    <span className="profile-label">Email</span>
                                    <span className="profile-value">{user.email}</span>
                                </div>
                                <div className="profile-item">
                                    <span className="profile-label">Phone</span>
                                    <span className="profile-value">{user.phone}</span>
                                </div>
                                <div className="profile-item">
                                    <span className="profile-label">Account Type</span>
                                    <span className="profile-value" style={{ textTransform: 'capitalize' }}>
                                        {user.userType}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
