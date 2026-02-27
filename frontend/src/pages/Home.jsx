import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { services, categories } from '../data/services';
import ServiceCard from '../components/ServiceCard';
import '../styles/home.css';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [hasSearched, setHasSearched] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const filteredServices = services.filter((service) => {
        const matchesCategory =
            selectedCategory === 'All' || service.category === selectedCategory;
        const matchesSearch =
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setHasSearched(true);
        // scroll down to results
        document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.trim() !== '') {
            setHasSearched(true);
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setHasSearched(true);
        document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSelectedCategory('All');
        setHasSearched(false);
        inputRef.current?.focus();
    };

    const showResults = hasSearched || selectedCategory !== 'All';

    return (
        <div className="home-page">
            {/* Search Hero */}
            <section className="search-hero">
                <div className="search-hero-content">
                    <h1 className="search-hero-title">
                        Find a <span className="hero-highlight">Service</span> Near You
                    </h1>
                    <p className="search-hero-subtitle">
                        Search from 10+ professional home services — plumbing, electrical, cleaning & more.
                    </p>

                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="search-input-wrapper">
                            <span className="search-input-icon">🔍</span>
                            <input
                                ref={inputRef}
                                type="text"
                                className="search-input"
                                placeholder="Search for plumbing, cleaning, painting..."
                                value={searchQuery}
                                onChange={handleInputChange}
                                autoFocus
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="search-clear-btn"
                                    onClick={clearSearch}
                                    title="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        <button type="submit" className="search-btn">
                            Search
                        </button>
                    </form>

                    {/* Quick Category Chips */}
                    <div className="quick-categories">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`quick-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Decorative blobs */}
                <div className="hero-blob hero-blob-1" />
                <div className="hero-blob hero-blob-2" />
            </section>

            {/* Stats Bar */}
            <div className="stats-bar">
                <div className="stat-item">
                    <span className="stat-number">10+</span>
                    <span className="stat-label">Services</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Verified Pros</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                    <span className="stat-number">4.8★</span>
                    <span className="stat-label">Avg Rating</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                    <span className="stat-number">10k+</span>
                    <span className="stat-label">Happy Customers</span>
                </div>
            </div>

            {/* Search Results / All Services */}
            <section id="search-results" className="results-section">
                <div className="container">
                    <div className="results-header">
                        {showResults ? (
                            <>
                                <h2 className="results-title">
                                    {filteredServices.length > 0
                                        ? `${filteredServices.length} Service${filteredServices.length !== 1 ? 's' : ''} Found`
                                        : 'No Services Found'}
                                </h2>
                                {(searchQuery || selectedCategory !== 'All') && (
                                    <button className="clear-filters-btn" onClick={clearSearch}>
                                        Clear Filters
                                    </button>
                                )}
                            </>
                        ) : (
                            <h2 className="results-title">All Services</h2>
                        )}
                    </div>

                    {filteredServices.length > 0 ? (
                        <div className="services-grid">
                            {filteredServices.map((service) => (
                                <ServiceCard key={service.id} service={service} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <div className="no-results-icon">🔍</div>
                            <h3>No services found</h3>
                            <p>Try a different keyword or browse all categories.</p>
                            <button className="btn-reset" onClick={clearSearch}>
                                Show All Services
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
