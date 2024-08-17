import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/about" className="footer-link">
          About
        </Link>
        <Link to="/privacy-policy" className="footer-link">
          Privacy Policy
        </Link>
      </div>
      <div className="footer-info">
        <p>© 2024 Your Game Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
