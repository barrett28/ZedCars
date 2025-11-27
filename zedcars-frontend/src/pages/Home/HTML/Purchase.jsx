// src/pages/Home/HTML/Purchase.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import apiClient from "../../../api/apiClient";
import { validators, validateForm } from "../../../utils/validation";
import "../CSS/Purchase.css";

const Purchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    carId: parseInt(id),
    buyerName: "",
    buyerEmail: "",
    purchaseQuantity: 1,
    selectedAccessories: [],
  });

  const [showAccessoryModal, setShowAccessoryModal] = useState(false);
  const [tempSelectedAccessories, setTempSelectedAccessories] = useState([]);

  useEffect(() => {
    if (id) {
      fetchPurchaseData();
    }
  }, [id]);

  const fetchPurchaseData = async () => {
    try {
      const response = await apiClient.get(`/home/purchase/${id}`);
      setCar(response.data.purchase.car);
      setAccessories(response.data.accessories);
      setFormData((prev) => ({
        ...prev,
        carId: response.data.purchase.car.carId,
      }));
    } catch (err) {
      setError("Failed to load purchase data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "purchaseQuantity" && value < 1) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAccessoryChange = (accessoryName, isChecked) => {
    if (isChecked) {
      setTempSelectedAccessories((prev) => [...prev, accessoryName]);
    } else {
      setTempSelectedAccessories((prev) =>
        prev.filter((name) => name !== accessoryName)
      );
    }
  };

  const saveAccessorySelection = () => {
    setFormData((prev) => ({
      ...prev,
      selectedAccessories: tempSelectedAccessories,
    }));
    setShowAccessoryModal(false);
  };

  const calculateTotals = () => {
    const carTotal = car ? car.price * formData.purchaseQuantity : 0;
    const accessoryTotal = formData.selectedAccessories.reduce(
      (total, accessoryName) => {
        const accessory = accessories.find((a) => a.name === accessoryName);
        return total + (accessory ? accessory.price : 0);
      },
      0
    );
    return { carTotal, accessoryTotal, grandTotal: carTotal + accessoryTotal };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const validationRules = {
      buyerName: [validators.required, validators.minLength(2)],
      buyerEmail: [validators.required, validators.email],
      purchaseQuantity: [
        validators.required,
        (value) => {
          const num = parseInt(value);
          if (num < 1) return "Quantity must be at least 1";
          if (num > car.stockQuantity)
            return `Only ${car.stockQuantity} available`;
          return null;
        },
      ],
    };

    const errors = validateForm(formData, validationRules);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmitting(false);
      return;
    }

    try {
      const response = await apiClient.post("/home/purchase", formData);
      alert("Purchase completed successfully!");
      navigate("/");
    } catch (err) {
      setError("Failed to complete purchase");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!car) return <div className="error">Car not found</div>;

  const { carTotal, accessoryTotal, grandTotal } = calculateTotals();

  return (
    <div className="purchase-page-wrapper">
      <div className="purchase-container">
        <div className="purchase-header">
          <div className="header-line"></div>
          <h1>VEHICLE ACQUISITION</h1>
          <div className="header-line"></div>
        </div>

        <div className="purchase-grid">
          {/* Left: Car Showcase */}
          <div className="car-showcase">
            <div className="car-image-frame">
              <img src={car.imageUrl} alt={car.model} />
              <div className="image-overlay"></div>
            </div>
            <div className="car-meta">
              <h2>{car.brand}</h2>
              <h3>{car.model}</h3>
              <div className="car-specs-grid">
                <div className="spec-item">
                  <span className="spec-label">FUEL</span>
                  <span className="spec-value">{car.fuelType}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">TRANSMISSION</span>
                  <span className="spec-value">{car.transmission}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">STOCK</span>
                  <span className="spec-value">{car.stockQuantity} Units</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">UNIT PRICE</span>
                  <span className="spec-value">
                    ${car.price?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Purchase Form */}
          <div className="purchase-form-section">
            <form onSubmit={handleSubmit} className="industrial-form">
              <div className="form-section">
                <h4>BUYER INFORMATION</h4>
                <div className="form-field">
                  <label>FULL NAME</label>
                  <input
                    type="text"
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter full name"
                  />
                  {validationErrors.buyerName && (
                    <span className="error-text">
                      {validationErrors.buyerName}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label>EMAIL ADDRESS</label>
                  <input
                    type="email"
                    name="buyerEmail"
                    value={formData.buyerEmail}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter email address"
                  />
                  {validationErrors.buyerEmail && (
                    <span className="error-text">
                      {validationErrors.buyerEmail}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label>QUANTITY</label>
                  <input
                    type="number"
                    name="purchaseQuantity"
                    value={formData.purchaseQuantity}
                    onChange={handleInputChange}
                    min="1"
                    max={car.stockQuantity}
                    required
                  />
                  {validationErrors.purchaseQuantity && (
                    <span className="error-text">
                      {validationErrors.purchaseQuantity}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h4>COST BREAKDOWN</h4>
                <div className="cost-table">
                  <div className="cost-row">
                    <span>Vehicle Cost ({formData.purchaseQuantity}x)</span>
                    <span>${carTotal.toLocaleString()}</span>
                  </div>
                  {formData.selectedAccessories.length > 0 && (
                    <>
                      <div className="cost-row accessories-header">
                        <span>Accessories</span>
                        <span></span>
                      </div>
                      {formData.selectedAccessories.map((accessoryName) => {
                        const accessory = accessories.find(
                          (a) => a.name === accessoryName
                        );
                        return accessory ? (
                          <div
                            key={accessoryName}
                            className="cost-row accessory-item-bill"
                          >
                            <span>{accessory.name}</span>
                            <span>${accessory.price.toLocaleString()}</span>
                          </div>
                        ) : null;
                      })}
                    </>
                  )}
                  <div className="cost-row total-row">
                    <span>TOTAL AMOUNT</span>
                    <span>${grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="action-grid">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setTempSelectedAccessories(formData.selectedAccessories);
                    setShowAccessoryModal(true);
                  }}
                >
                  <span>ADD ACCESSORIES</span>
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  <span>
                    {submitting ? "PROCESSING..." : "CONFIRM PURCHASE"}
                  </span>
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => navigate("/")}
                >
                  <span>CANCEL</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Accessories Modal */}
        {showAccessoryModal && (
          <div className="purchase-accessory-modal-overlay">
            <div className="purchase-accessory-modal">
              <div className="purchase-accessory-modal-header">
                <h3>ACCESSORY SELECTION</h3>
                <button
                  className="purchase-accessory-close-btn"
                  onClick={() => setShowAccessoryModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="purchase-accessory-modal-body">
                {Object.entries(
                  accessories.reduce((groups, accessory) => {
                    const category = accessory.category || "Other";
                    if (!groups[category]) groups[category] = [];
                    groups[category].push(accessory);
                    return groups;
                  }, {})
                ).map(([category, categoryAccessories]) => (
                  <div key={category} className="purchase-accessory-group">
                    <h5>{category.toUpperCase()}</h5>
                    <div className="purchase-accessory-list">
                      {categoryAccessories.map((accessory) => (
                        <div
                          key={accessory.accessoryId}
                          className={`purchase-accessory-box ${
                            tempSelectedAccessories.includes(accessory.name)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleAccessoryChange(
                              accessory.name,
                              !tempSelectedAccessories.includes(accessory.name)
                            )
                          }
                        >
                          <span className="purchase-accessory-name">
                            {accessory.name}
                          </span>
                          <span className="purchase-accessory-price">
                            ${accessory.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="purchase-accessory-modal-footer">
                <button
                  className="btn-cancel"
                  onClick={() => setShowAccessoryModal(false)}
                >
                  CLOSE
                </button>
                <button
                  className="btn-primary"
                  onClick={saveAccessorySelection}
                >
                  SAVE SELECTION
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchase;
