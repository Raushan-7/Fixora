import { useParams, Link, useNavigate } from 'react-router-dom';
import { services } from '../data/services';
import { useAuth } from '../context/AuthContext';
import '../styles/services.css';

const ServiceDetail = () => {
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const service = services.find((s) => s.id === id);

    if (!service) {
        return (
            <div className="page-wrapper">
                <div className="container text-center">
                    <h2>Service Not Found</h2>
                    <p>The service you're looking for doesn't exist.</p>
                    <Link to="/services" className="btn btn-primary">
                        Back to Services
                    </Link>
                </div>
            </div>
        );
    }

    const isWorker = user?.userType === 'worker';

    const handleBookNow = () => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            navigate(`/booking/${service.id}`);
        }
    };

    const relatedServices = services
        .filter((s) => s.category === service.category && s.id !== service.id)
        .slice(0, 3);

    return (
        <div className="page-wrapper">
            <div className="container">
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div className="card">
                        <img
                            src={service.image}
                            alt={service.name}
                            style={{
                                width: '100%',
                                height: '400px',
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: 'var(--spacing-xl)'
                            }}
                            onError={(e) => {
                                e.target.style.background = 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)';
                                e.target.style.display = 'flex';
                                e.target.style.alignItems = 'center';
                                e.target.style.justifyContent = 'center';
                                e.target.innerHTML = '<span style="color: white; font-size: 5rem;">🔧</span>';
                            }}
                        />

                        <span className="service-category">{service.category}</span>
                        <h1>{service.name}</h1>
                        <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
                            {service.detailedDescription}
                        </p>

                        <div className="grid grid-2" style={{ marginTop: 'var(--spacing-xl)' }}>
                            <div>
                                <h3>Price Range</h3>
                                <p className="service-price" style={{ fontSize: '1.5rem' }}>
                                    {service.priceRange}
                                </p>
                            </div>
                            <div>
                                <h3>Duration</h3>
                                <p style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                                    ⏱️ {service.duration}
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: 'var(--spacing-xl)' }}>
                            <h3>What's Included</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {service.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            padding: 'var(--spacing-sm) 0',
                                            borderBottom: '1px solid var(--border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-sm)'
                                        }}
                                    >
                                        <span style={{ color: 'var(--success)', fontSize: '1.25rem' }}>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {isWorker ? (
                            <Link
                                to="/worker-jobs"
                                className="btn btn-outline btn-large"
                                style={{ width: '100%', marginTop: 'var(--spacing-2xl)', textAlign: 'center' }}
                            >
                                🔍 Browse Available Jobs
                            </Link>
                        ) : (
                            <button
                                onClick={handleBookNow}
                                className="btn btn-primary btn-large"
                                style={{ width: '100%', marginTop: 'var(--spacing-2xl)' }}
                            >
                                Book This Service
                            </button>
                        )}
                    </div>

                    {relatedServices.length > 0 && (
                        <div style={{ marginTop: 'var(--spacing-3xl)' }}>
                            <h2>Related Services</h2>
                            <div className="grid grid-3" style={{ marginTop: 'var(--spacing-lg)' }}>
                                {relatedServices.map((relatedService) => (
                                    <div key={relatedService.id} className="service-card">
                                        <img
                                            src={relatedService.image}
                                            alt={relatedService.name}
                                            className="service-image"
                                        />
                                        <div className="service-content">
                                            <h3 className="service-title">{relatedService.name}</h3>
                                            <p className="service-description">{relatedService.description}</p>
                                            <Link to={`/services/${relatedService.id}`} className="btn btn-outline btn-small">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
