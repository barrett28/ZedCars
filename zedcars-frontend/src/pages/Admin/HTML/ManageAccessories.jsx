import React, { useState, useEffect } from "react";
import apiClient from "../../../api/apiClient";
import "../CSS/ManageAccessories.css";

const ManageAccessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stockQuantity: "",
    description: "",
    partNumber: "",
    manufacturer: "",
    isActive: true
  });

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await apiClient.get("/accessory", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccessories(response.data.accessories || response.data || []);
    } catch (error) {
      console.error("Error fetching accessories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity)
      };

      if (editingAccessory) {
        await apiClient.put(`/accessory/${editingAccessory.accessoryId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await apiClient.post("/accessory", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setShowModal(false);
      setEditingAccessory(null);
      setFormData({
        name: "",
        category: "",
        price: "",
        stockQuantity: "",
        description: "",
        partNumber: "",
        manufacturer: "",
        isActive: true
      });
      fetchAccessories();
    } catch (error) {
      console.error("Error saving accessory:", error);
    }
  };

  const handleEdit = (accessory) => {
    setEditingAccessory(accessory);
    setFormData({
      name: accessory.name || "",
      category: accessory.category || "",
      price: accessory.price || "",
      stockQuantity: accessory.stockQuantity || "",
      description: accessory.description || "",
      partNumber: accessory.partNumber || "",
      manufacturer: accessory.manufacturer || "",
      isActive: accessory.isActive !== false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this accessory?")) {
      try {
        const token = localStorage.getItem("jwtToken");
        await apiClient.delete(`/accessory/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchAccessories();
      } catch (error) {
        console.error("Error deleting accessory:", error);
      }
    }
  };

  if (loading) return <div className="loading">Loading accessories...</div>;

  return (
    <div className="manage-accessories">
      <div className="page-header">
        <h1>Manage Accessories</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add New Accessory
        </button>
      </div>

      <div className="accessories-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accessories.map((accessory) => (
              <tr key={accessory.accessoryId}>
                <td>{accessory.name}</td>
                <td>{accessory.category}</td>
                <td>${accessory.price?.toFixed(2)}</td>
                <td>{accessory.stockQuantity}</td>
                <td>
                  <span className={`status ${accessory.isActive ? 'active' : 'inactive'}`}>
                    {accessory.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEdit(accessory)}>
                    Edit
                  </button>
                  <button className="btn btn-delete" onClick={() => handleDelete(accessory.accessoryId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingAccessory ? 'Edit Accessory' : 'Add New Accessory'}</h2>
            <form onSubmit={handleSubmit}>
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
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-group">
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
              <div className="modal-actions">
                <button type="button" className="btn btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-save">
                  {editingAccessory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAccessories;
