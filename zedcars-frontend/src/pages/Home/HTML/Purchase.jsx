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
    <div className="purchase-container">
      <h2>Purchase Car</h2>

      <div className="purchase-card">
        {/* Car Info Section */}
        <div className="car-info-section">
          <div className="car-details">
            <h4>
              {car.brand} - {car.model}
            </h4>
            <p className="purchase-price">
              Price: ${car.price?.toLocaleString()}
            </p>
            <p className="stock">Stock: {car.stockQuantity} available</p>
            <div className="car-specs">
              <span>{car.fuelType}</span>
              <span>{car.transmission}</span>
            </div>
          </div>
          <div className="car-image">
            <img src={car.imageUrl} alt={car.model} />
          </div>
        </div>

        {/* Purchase Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="buyerName"
              value={formData.buyerName}
              onChange={handleInputChange}
              required
              {...(validationErrors.buyerName && (
                <span className="error-text">{validationErrors.buyerName}</span>
              ))}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="buyerEmail"
              value={formData.buyerEmail}
              onChange={handleInputChange}
              {...(validationErrors.buyerEmail && (
                <span className="error-text">
                  {validationErrors.buyerEmail}
                </span>
              ))}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="purchaseQuantity"
              value={formData.purchaseQuantity}
              onChange={handleInputChange}
              {...(validationErrors.purchaseQuantity && (
                <span className="error-text">
                  {validationErrors.purchaseQuantity}
                </span>
              ))}
              min="1"
              max={car.stockQuantity}
              required
            />
          </div>

          {/* Price Summary */}
          <div className="price-summary">
            <h5>Price Summary</h5>
            <div className="price-row">
              <span>Car Price:</span>
              <span>${carTotal.toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span>Accessories:</span>
              <span>${accessoryTotal.toLocaleString()}</span>
            </div>
            <div className="price-row total">
              <span>Total:</span>
              <span>${grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="action-buttons">
            <button
              type="button"
              className="accessories-btn"
              onClick={() => {
                setTempSelectedAccessories(formData.selectedAccessories);
                setShowAccessoryModal(true);
              }}
            >
              Choose Accessories
            </button>
            <button
              type="submit"
              className="purchase-btn"
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Purchase"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Accessories Modal */}
      {showAccessoryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Select Accessories</h5>
              <button onClick={() => setShowAccessoryModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {Object.entries(
                accessories.reduce((groups, accessory) => {
                  const category = accessory.category || "Other";
                  if (!groups[category]) groups[category] = [];
                  groups[category].push(accessory);
                  return groups;
                }, {})
              ).map(([category, categoryAccessories]) => (
                <div key={category} className="accessory-category">
                  <h6>{category}</h6>
                  {categoryAccessories.map((accessory) => (
                    <div key={accessory.accessoryId} className="accessory-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={tempSelectedAccessories.includes(
                            accessory.name
                          )}
                          onChange={(e) =>
                            handleAccessoryChange(
                              accessory.name,
                              e.target.checked
                            )
                          }
                        />
                        <span>{accessory.name}</span>
                        <span className="price">${accessory.price}</span>
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowAccessoryModal(false)}>
                Close
              </button>
              <button onClick={saveAccessorySelection}>Save Selection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchase;
