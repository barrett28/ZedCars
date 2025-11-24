import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import "../../Admin/CSS/AddAccessory.css"

const AddAccessory = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stockQuantity: "",
    description: "",
    partNumber: "",
    manufacturer: "",
    isActive: true,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'name' || name === 'category') {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData((prev) => ({ ...prev, [name]: lettersOnly }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("jwtToken");
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
      };

      await apiClient.post("/accessory", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Accessory created successfully!");
      navigate("/Admin/ManageAccessories");
    } catch (error) {
      console.error("Error creating accessory:", error);
      alert("Failed to create accessory.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-accessory-container">
      <div className="page-header">
        <h1>Add New Accessory</h1>
        <button className="btn-back" onClick={() => navigate("/Admin/ManageAccessories")}>
          ← Back
        </button>
      </div>

      <form className="create-accessory-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Part Number</label>
            <input
              type="text"
              name="partNumber"
              value={formData.partNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Manufacturer</label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            Active
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/Admin/ManageAccessories")}
          >
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={submitting}>
            {submitting ? "Saving..." : "Create Accessory"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAccessory;
