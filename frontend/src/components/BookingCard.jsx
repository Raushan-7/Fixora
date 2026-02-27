import { useAuth } from '../context/AuthContext';
import { apiCancelBooking, apiCompleteJob } from '../utils/api';

const BookingCard = ({ booking, onUpdate }) => {
    const { user } = useAuth();
    const isWorker = user?.userType === 'worker';

    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await apiCancelBooking(booking._id);
                if (onUpdate) onUpdate();
            } catch (err) {
                alert('Failed to cancel booking: ' + err.message);
            }
        }
    };

    const handleComplete = async () => {
        if (window.confirm('Mark this job as completed?')) {
            try {
                await apiCompleteJob(booking._id);
                if (onUpdate) onUpdate();
            } catch (err) {
                alert('Failed to complete job: ' + err.message);
            }
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending': return 'badge-pending';
            case 'Confirmed': return 'badge-confirmed';
            case 'Completed': return 'badge-completed';
            case 'Cancelled': return 'badge-cancelled';
            default: return 'badge-pending';
        }
    };

    return (
        <div className="booking-item">
            <div className="booking-item-header">
                <h3 className="booking-item-title">{booking.serviceName}</h3>
                <span className={`badge ${getStatusClass(booking.status)}`}>
                    {booking.status}
                </span>
            </div>
            <div className="booking-item-details">
                <p>📅 {new Date(booking.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</p>
                <p>🕐 {booking.time}</p>
                <p>📍 {booking.address}</p>
                {booking.notes && <p>📝 {booking.notes}</p>}
                <p><strong>Price:</strong> {booking.price}</p>
                {isWorker && booking.workerName && (
                    <p>🔧 <strong>Assigned to:</strong> {booking.workerName}</p>
                )}
            </div>

            <div className="booking-item-actions">
                {/* Customer: can cancel a Pending booking */}
                {!isWorker && booking.status === 'Pending' && (
                    <button
                        className="btn btn-small btn-outline"
                        style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                        onClick={handleCancel}
                    >
                        Cancel Booking
                    </button>
                )}

                {/* Worker: can mark a Confirmed job as Complete */}
                {isWorker && booking.status === 'Confirmed' && (
                    <button
                        className="btn btn-small btn-complete"
                        onClick={handleComplete}
                    >
                        ✅ Mark Complete
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookingCard;
