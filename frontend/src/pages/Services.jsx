import { useState } from 'react';
import { services, categories } from '../data/services';
import ServiceCard from '../components/ServiceCard';
import '../styles/services.css';

const Services = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredServices = services.filter((service) => {
        const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="services-page">
            <div className="container">
                <div className="services-header">
                    <h1>Our Services</h1>
                    <p>Browse through our comprehensive range of professional services</p>
                </div>

                <div className="services-filters">
                    <div className="filter-group">
                        <label className="filter-label">Search Services</label>
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search for services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Filter by Category</label>
                        <div className="category-filters">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {filteredServices.length > 0 ? (
                    <div className="services-grid">
                        {filteredServices.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                ) : (
                    <div className="no-services">
                        <h3>No services found</h3>
                        <p>Try adjusting your filters or search query</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;
