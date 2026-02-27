import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
    return (
        <div className="service-card">
            <img
                src={service.image}
                alt={service.name}
                className="service-image"
                onError={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)';
                    e.target.style.display = 'flex';
                    e.target.style.alignItems = 'center';
                    e.target.style.justifyContent = 'center';
                    e.target.innerHTML = '<span style="color: white; font-size: 3rem;">🔧</span>';
                }}
            />
            <div className="service-content">
                <span className="service-category">{service.category}</span>
                <h3 className="service-title">{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-meta">
                    <span className="service-price">{service.priceRange}</span>
                    <span className="service-duration">⏱️ {service.duration}</span>
                </div>
            </div>
            <div className="service-card-footer">
                <Link to={`/services/${service.id}`} className="btn btn-primary">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ServiceCard;
