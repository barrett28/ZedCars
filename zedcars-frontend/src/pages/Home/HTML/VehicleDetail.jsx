import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import apiClient from "../../../api/apiClient";
import { getFirstImageUrl, getAllImageUrls } from "../../../utils/imageUtils";
import "../CSS/VehicleDetail.css";

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [testDriveData, setTestDriveData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    bookingDate: "",
    timeSlot: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) fetchCarDetails();
  }, [id]);

  useEffect(() => {
    if (user?.isAuthenticated) {
      setTestDriveData((prev) => ({
        ...prev,
        customerName: user.fullName || "",
        customerEmail: user.email || "",
      }));
    }
  }, [user]);

  const fetchCarDetails = async () => {
    try {
      const response = await apiClient.get(`/home/vehicle/${id}`);
      setCar(response.data);
    } catch (err) {
      setError("Failed to load vehicle details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (date) => {
    if (!date) return;
    setLoadingSlots(true);
    try {
      const response = await apiClient.get(
        `/home/available-slots/${id}?date=${date}`
      );
      setAvailableSlots(response.data || []);
    } catch (err) {
      setAvailableSlots(["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestDriveData((prev) => ({ ...prev, [name]: value }));
    if (name === "bookingDate") {
      setTestDriveData((prev) => ({ ...prev, timeSlot: "" }));
      fetchAvailableSlots(value);
    }
  };

  const handleTestDriveSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post("/home/book-testdrive", {
        ...testDriveData,
        carId: parseInt(id),
      });
      alert("Test drive booked successfully! We’ll contact you soon.");
      setShowModal(false);
      setTestDriveData((prev) => ({
        ...prev,
        customerPhone: "",
        bookingDate: "",
        timeSlot: "",
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="vd-loading">Loading vehicle details...</div>;
  if (error) return <div className="vd-error">{error}</div>;
  if (!car) return <div className="vd-error">Vehicle not found</div>;

  return (
    <div className="vd-page">
      {/* Breadcrumb */}
      <div className="vd-breadcrumb">
        <span onClick={() => navigate("/")}>Home</span>
        <span>/</span>
        <span onClick={() => navigate("/inventory")}>Inventory</span>
        <span>/</span>
        <span className="current">
          {car.brand} {car.model}
        </span>
      </div>

      {/* Hero Section */}
      <section className="vd-hero-section">
        <div className="vd-image-container">
          <img
            src={
              getFirstImageUrl(car.imageUrl) ||
              "https://via.placeholder.com/1200x800/111827/ffffff?text=NO+IMAGE"
            }
            alt={`${car.brand} ${car.model}`}
            className="vd-main-image"
          />
          <div className="vd-stock-badge">
            {car.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
          </div>
        </div>

        <div className="vd-info-panel">
          <h1 className="vd-title">
            {car.year} {car.brand} {car.model}{" "}
            {car.variant && <span className="variant">{car.variant}</span>}
          </h1>

          <div className="vd-price-tag">
            <span className="vd-currency">$</span>
            {car.price?.toLocaleString()}
          </div>

          <div className="vd-key-specs">
            <div className="spec">
              <strong>Transmission</strong> {car.transmission || "—"}
            </div>
            <div className="spec">
              <strong>Fuel</strong> {car.fuelType || "—"}
            </div>
            <div className="spec">
              <strong>Mileage</strong>{" "}
              {car.mileage ? `${car.mileage} MPG` : "—"}
            </div>
            <div className="spec">
              <strong>Color</strong> {car.color || "—"}
            </div>
          </div>

          <div className="vd-actions">
            {user?.isAuthenticated && user.role === "Customer" ? (
              <>
                <button
                  className="vd-btn vd-btn-primary"
                  onClick={() => navigate(`/purchase/${car.carId}`)}
                >
                  Buy Now
                </button>
                <button
                  className="vd-btn vd-btn-outline"
                  onClick={() => setShowModal(true)}
                >
                  Schedule Test Drive
                </button>
              </>
            ) : (
              <button
                className="vd-btn vd-btn-outline"
                onClick={() => navigate("/contact")}
              >
                Contact Dealer
              </button>
            )}
          </div>

          <div className="vd-meta-info">
            <div>
              <strong>Stock ID:</strong> #{car.carId}
            </div>
            <div>
              <strong>Available:</strong> {car.stockQuantity} unit(s)
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="vehicle-modern">
        {/* Specs Band */}
        <div className="vm-spec-bar">
          {[
            ["Brand", car.brand],
            ["Model", car.model],
            ["Year", car.year],
            ["Transmission", car.transmission],
            ["Fuel", car.fuelType],
            ["Mileage", car.mileage ? `${car.mileage} MPG` : "—"],
          ].map(([label, value]) => (
            <div className="vm-spec-item" key={label}>
              <p className="vm-label">{label}</p>
              <h3 className="vm-value">{value || "—"}</h3>
            </div>
          ))}
        </div>

        {/* About Section */}
        <div className="vm-card">
          <h2>About This Vehicle</h2>
          <p>
            {car.description ||
              `The ${car.year} ${car.brand} ${car.model} offers a harmonious balance of performance, luxury, and advanced technology. Its refined interiors and modern engineering ensure an outstanding driving experience.`}
          </p>
        </div>

        {/* Features */}
        <div className="vm-card">
          <h2>Features & Highlights</h2>

          <div className="vm-feature-block">
            <h3>Safety</h3>
            <div className="vm-tags">
              <span>ABS</span>
              <span>Electronic Stability Control</span>
              <span>Multiple Airbags</span>
              <span>Reverse Camera</span>
              <span>Blind Spot Monitoring</span>
            </div>
          </div>

          <div className="vm-feature-block">
            <h3>Comfort</h3>
            <div className="vm-tags">
              <span>Leather Interior</span>
              <span>Dual-Zone AC</span>
              <span>Keyless Entry</span>
              <span>Power Seats</span>
              <span>Heated & Ventilated Seats</span>
            </div>
          </div>

          <div className="vm-feature-block">
            <h3>Technology</h3>
            <div className="vm-tags">
              <span>Touchscreen Display</span>
              <span>Apple CarPlay</span>
              <span>Android Auto</span>
              <span>Wireless Charging</span>
              <span>360° Camera</span>
            </div>
          </div>
        </div>
      </div>

      {/* Test Drive Modal */}
      {showModal && (
        <div className="vd-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="vd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="vd-modal-header">
              <h2>Schedule a Test Drive</h2>
              <button onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleTestDriveSubmit} className="vd-form">
              <div className="vd-form-grid">
                <div className="vd-input-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={testDriveData.customerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="vd-input-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={testDriveData.customerEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="vd-input-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={testDriveData.customerPhone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="vd-input-group">
                  <label>Preferred Date *</label>
                  <input
                    type="date"
                    name="bookingDate"
                    value={testDriveData.bookingDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>

              <div className="vd-time-section">
                <label>Available Time Slots</label>
                {loadingSlots ? (
                  <p>Loading available times...</p>
                ) : availableSlots.length > 0 ? (
                  <div className="vd-slots">
                    {availableSlots.map((slot) => (
                      <label
                        key={slot}
                        className={`vd-slot ${
                          testDriveData.timeSlot === slot ? "selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="timeSlot"
                          value={slot}
                          checked={testDriveData.timeSlot === slot}
                          onChange={handleInputChange}
                        />
                        {slot}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p>No slots available for selected date</p>
                )}
              </div>

              <div className="vd-modal-footer">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !testDriveData.timeSlot}
                >
                  {submitting ? "Booking..." : "Book Test Drive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetail;
