import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">ezLeave</h2>
          <p className="text-sm">
            Simplify your leave management process with ease and efficiency.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/features"
                className="hover:text-white transition-colors"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className="hover:text-white transition-colors"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/help" className="hover:text-white transition-colors">
                Help Center
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/docs" className="hover:text-white transition-colors">
                Documentation
              </Link>
            </li>
            <li>
              <Link to="/api" className="hover:text-white transition-colors">
                API
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="mailto:support@ezleave.com"
                className="hover:text-white transition-colors"
              >
                support@ezleave.com
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/ezleave"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/ezleave"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Twitter
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} ezLeave. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
