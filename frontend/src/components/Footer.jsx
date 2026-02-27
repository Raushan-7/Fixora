import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <div className="footer-logo">Fixora</div>
                    <p className="footer-description">
                        Your trusted platform for booking professional blue-collar services.
                        Quality work, reliable professionals, guaranteed satisfaction.
                    </p>
                    <div className="footer-social">
                        <a href="#" className="footer-social-link" aria-label="Facebook">
                            <span>f</span>
                        </a>
                        <a href="#" className="footer-social-link" aria-label="Twitter">
                            <span>𝕏</span>
                        </a>
                        <a href="#" className="footer-social-link" aria-label="Instagram">
                            <span>📷</span>
                        </a>
                        <a href="#" className="footer-social-link" aria-label="LinkedIn">
                            <span>in</span>
                        </a>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">Sign Up</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Services</h3>
                    <ul className="footer-links">
                        <li><Link to="/services">Plumbing</Link></li>
                        <li><Link to="/services">Electrician</Link></li>
                        <li><Link to="/services">Home Cleaning</Link></li>
                        <li><Link to="/services">Gardening</Link></li>
                        <li><Link to="/services">Painting</Link></li>
                        <li><Link to="/services">Carpentry</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Contact Info</h3>
                    <ul className="footer-links">
                        <li>📧 support@fixora.com</li>
                        <li>📞 +91 98765 43210</li>
                        <li>📍 Mumbai, Maharashtra, India</li>
                        <li>🕐 Mon-Sat: 9AM - 8PM</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} Fixora2. All rights reserved. Built with ❤️ for blue-collar workers.</p>
            </div>
        </footer>
    );
};

export default Footer;
