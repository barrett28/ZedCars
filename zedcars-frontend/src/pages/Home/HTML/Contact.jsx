import React from "react";
import "../CSS/Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">Get in Touch</h1>
          <p className="lead text-secondary">
            Have questions or feedback? We’re here to help you every step of the way.
          </p>
        </div>

        {/* Info Cards */}
        <div className="row g-4 mb-5">
          <div className="col-lg-4 col-md-6">
            <div className="info-card">
              <div className="icon-wrapper">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <h5>Our Location</h5>
              <p>123 Auto Avenue, Cartown, CT 12345</p>
              <p>
                <strong>Phone:</strong>{" "}
                <a href="tel:+14255550100" className="link">
                  425.555.0100
                </a>
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="info-card">
              <div className="icon-wrapper">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <h5>Contact Emails</h5>
              <p>
                <strong>Support:</strong>{" "}
                <a href="mailto:support@zedcars.com" className="link">
                  support@zedcars.com
                </a>
              </p>
              <p>
                <strong>Sales:</strong>{" "}
                <a href="mailto:sales@zedcars.com" className="link">
                  sales@zedcars.com
                </a>
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-12">
            <div className="info-card">
              <div className="icon-wrapper">
                <i className="bi bi-clock-fill"></i>
              </div>
              <h5>Business Hours</h5>
              <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
              <p>Sun: 9:00 AM - 7:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="contact-form">
              <h3 className="text-center mb-4">Send Us a Message</h3>
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email Address"
                    />
                  </div>
                  <div className="col-12">
                    <select className="form-select">
                      <option className="text-muted" value="">Select Subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales Question</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Your Message"
                    ></textarea>
                  </div>
                  <div className="col-12 text-center">
                    <button type="submit" className="btn-submit">
                      <i className="bi bi-send me-2"></i>Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
