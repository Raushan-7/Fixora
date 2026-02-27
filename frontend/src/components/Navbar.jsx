import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        setMenuOpen(false);
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const closeMenu = () => {
        setMenuOpen(false);
        setDropdownOpen(false);
    };

    const isWorker = user?.userType === 'worker';

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    Fixora
                </Link>

                <button className="navbar-toggle" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
                    {isAuthenticated ? (
                        <>
                            {/* Customer:  Dashboard → Services → My Bookings → Contact  */}
                            {/* Worker:    Dashboard → Services → Browse Jobs → My Jobs → Contact */}
                            <li>
                                <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={closeMenu}>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className={`navbar-link ${isActive('/services') ? 'active' : ''}`} onClick={closeMenu}>
                                    Services
                                </Link>
                            </li>
                            {isWorker && (
                                <li>
                                    <Link to="/worker-jobs" className={`navbar-link ${isActive('/worker-jobs') ? 'active' : ''}`} onClick={closeMenu}>
                                        Browse Jobs
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link to="/my-bookings" className={`navbar-link ${isActive('/my-bookings') ? 'active' : ''}`} onClick={closeMenu}>
                                    {isWorker ? 'My Jobs' : 'My Bookings'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className={`navbar-link ${isActive('/contact') ? 'active' : ''}`} onClick={closeMenu}>
                                    Contact
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            {/* Guest: Services → Contact */}
                            <li>
                                <Link to="/services" className={`navbar-link ${isActive('/services') ? 'active' : ''}`} onClick={closeMenu}>
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className={`navbar-link ${isActive('/contact') ? 'active' : ''}`} onClick={closeMenu}>
                                    Contact
                                </Link>
                            </li>
                        </>
                    )}

                    <div className="navbar-actions">
                        <button
                            className="theme-toggle"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        {isAuthenticated ? (
                            <div className="navbar-user">
                                <button className="navbar-user-btn" onClick={toggleDropdown}>
                                    <div className="navbar-user-avatar">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{user?.name}</span>
                                </button>
                                <div className={`navbar-dropdown ${dropdownOpen ? 'active' : ''}`}>
                                    <Link to="/dashboard" className="navbar-dropdown-item" onClick={closeMenu}>
                                        Dashboard
                                    </Link>
                                    <Link to="/services" className="navbar-dropdown-item" onClick={closeMenu}>
                                        Services
                                    </Link>
                                    {isWorker && (
                                        <Link to="/worker-jobs" className="navbar-dropdown-item" onClick={closeMenu}>
                                            Browse Jobs
                                        </Link>
                                    )}
                                    <Link to="/my-bookings" className="navbar-dropdown-item" onClick={closeMenu}>
                                        {isWorker ? 'My Jobs' : 'My Bookings'}
                                    </Link>
                                    <Link to="/contact" className="navbar-dropdown-item" onClick={closeMenu}>
                                        Contact
                                    </Link>
                                    <button className="navbar-dropdown-item logout" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline btn-small" onClick={closeMenu}>
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-primary btn-small" onClick={closeMenu}>
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
