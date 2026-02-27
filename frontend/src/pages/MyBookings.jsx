import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGetBookings } from '../utils/api';
import BookingCard from '../components/BookingCard';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);

    const isWorker = user?.userType === 'worker';

    const loadBookings = async () => {
        try {
            const data = await apiGetBookings();
            setBookings(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error('Failed to load bookings:', err.message);
        }
    };

    const [filter, setFilter] = useState('All');

    useEffect(() => {
        loadBookings();
    }, [user]);

    const filteredBookings = filter === 'All'
        ? bookings
        : bookings.filter((b) => b.status === filter);

    const statusCounts = {
        All: bookings.length,
        Pending: bookings.filter((b) => b.status === 'Pending').length,
        Confirmed: bookings.filter((b) => b.status === 'Confirmed').length,
        Completed: bookings.filter((b) => b.status === 'Completed').length,
        Cancelled: bookings.filter((b) => b.status === 'Cancelled').length
    };

    return (
        <div className="page-wrapper">
            <div className="container">
                <div className="page-title">
                    <h1>{isWorker ? 'My Jobs' : 'My Bookings'}</h1>
                    <p>
                        {isWorker
                            ? 'View and manage the jobs you have accepted'
                            : 'View and manage all your service bookings'}
                    </p>
                </div>

                {isWorker && (
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <Link to="/worker-jobs" className="btn btn-primary">
                            🔍 Browse Available Jobs
                        </Link>
                    </div>
                )}

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-label">{isWorker ? 'Total Jobs' : 'Total Bookings'}</div>
                        <div className="stat-value">{statusCounts.All}</div>
                    </div>
                    {isWorker ? (
                        <div className="stat-card secondary">
                            <div className="stat-label">In Progress</div>
                            <div className="stat-value">{statusCounts.Confirmed}</div>
                        </div>
                    ) : (
                        <div className="stat-card secondary">
                            <div className="stat-label">Pending</div>
                            <div className="stat-value">{statusCounts.Pending}</div>
                        </div>
                    )}
                    <div className="stat-card accent">
                        <div className="stat-label">{isWorker ? 'Confirmed' : 'Confirmed'}</div>
                        <div className="stat-value">{statusCounts.Confirmed}</div>
                    </div>
                    <div className="stat-card info">
                        <div className="stat-label">Completed</div>
                        <div className="stat-value">{statusCounts.Completed}</div>
                    </div>
                </div>

                <div className="services-filters" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <div className="filter-group">
                        <label className="filter-label">Filter by Status</label>
                        <div className="category-filters">
                            {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                                <button
                                    key={status}
                                    className={`category-btn ${filter === status ? 'active' : ''}`}
                                    onClick={() => setFilter(status)}
                                >
                                    {status} ({statusCounts[status] || 0})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {filteredBookings.length > 0 ? (
                    <div className="booking-list">
                        {filteredBookings.map((booking) => (
                            <BookingCard key={booking._id} booking={booking} onUpdate={loadBookings} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">{isWorker ? '🔧' : '📋'}</div>
                        <h3>{isWorker ? 'No jobs found' : 'No bookings found'}</h3>
                        <p>
                            {filter === 'All'
                                ? isWorker
                                    ? "You haven't accepted any jobs yet"
                                    : "You haven't made any bookings yet"
                                : `No ${filter.toLowerCase()} ${isWorker ? 'jobs' : 'bookings'}`}
                        </p>
                        {isWorker ? (
                            <Link to="/worker-jobs" className="btn btn-primary" style={{ marginTop: 'var(--spacing-lg)' }}>
                                Browse Available Jobs
                            </Link>
                        ) : (
                            <Link to="/services" className="btn btn-primary" style={{ marginTop: 'var(--spacing-lg)' }}>
                                Browse Services
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
