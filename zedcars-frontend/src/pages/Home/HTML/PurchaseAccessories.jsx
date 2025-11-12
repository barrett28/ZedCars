import React, { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";
import { useNavigate } from "react-router-dom";

const PurchaseAccessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerEmail: "",
    selectedAccessories: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const fetchAccessories = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setErrorMsg("You must be logged in to view accessories.");
        navigate("/Auth/Login");
        return;
      }

      const response = await apiClient.get("/home/accessories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle both direct array and nested object response
      const accessoriesData = response.data?.accessories || response.data || [];
      setAccessories(accessoriesData);
    } catch (error) {
      console.error("Error fetching accessories:", error);
      setErrorMsg("Failed to load accessories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessories();
  }, []);

  const handleAccessorySelect = (accessoryName) => {
    setFormData((prev) => {
      const alreadySelected = prev.selectedAccessories.includes(accessoryName);
      return {
        ...prev,
        selectedAccessories: alreadySelected
          ? prev.selectedAccessories.filter((a) => a !== accessoryName)
          : [...prev.selectedAccessories, accessoryName],
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Please log in to continue.");
      navigate("/Auth/Login");
      return;
    }

    if (formData.selectedAccessories.length === 0) {
      setErrorMsg("Please select at least one accessory before purchasing.");
      return;
    }

    try {
      const payload = {
        buyerName: formData.buyerName,
        buyerEmail: formData.buyerEmail,
        selectedAccessories: formData.selectedAccessories,
      };

      await apiClient.post("/home/accessories", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Purchase successful!");
      navigate("/");
    } catch (error) {
      console.error("Purchase failed:", error);
      setErrorMsg("Failed to complete purchase. Please try again.");
    }
  };

  const groupedAccessories = Array.isArray(accessories) 
    ? accessories.reduce((groups, item) => {
        const category = item.category || "Other";
        if (!groups[category]) groups[category] = [];
        groups[category].push(item);
        return groups;
      }, {})
    : {};

  // Calculate total price of selected accessories
  const calculateTotal = () => {
    if (!Array.isArray(accessories)) return 0;
    return accessories
      .filter(accessory => formData.selectedAccessories.includes(accessory.name))
      .reduce((total, accessory) => total + (accessory.price || 0), 0);
  };

  const totalPrice = calculateTotal();

  if (loading) return <div className="text-center p-5">Loading accessories...</div>;

  return (
    <div className="container p-4">
      <h2 className="mb-4 text-center">Purchase Accessories</h2>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="buyerEmail"
                  value={formData.buyerEmail}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <h5 className="mb-3">Select Accessories</h5>
            <div className="row">
              {Object.entries(groupedAccessories).map(([category, items]) => (
                <div key={category} className="col-md-6 mb-4">
                  <h6 className="border-bottom pb-1 fw-bold">{category}</h6>
                  {items.map((accessory) => (
                    <div key={accessory.accessoryId} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.selectedAccessories.includes(accessory.name)}
                        onChange={() => handleAccessorySelect(accessory.name)}
                        id={`accessory_${accessory.accessoryId}`}
                      />
                      <label className="form-check-label" htmlFor={`accessory_${accessory.accessoryId}`}>
                        {accessory.name}{" "}
                        <span className="text-success fw-bold">
                          (${accessory.price?.toFixed(2)})
                        </span>
                        {accessory.stockQuantity <= 5 && (
                          <span className="badge bg-warning text-dark ms-1">Low Stock</span>
                        )}
                      </label>
                      {accessory.description && (
                        <small className="text-muted d-block">{accessory.description}</small>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Total Price Display */}
            {formData.selectedAccessories.length > 0 && (
              <div className="alert alert-info">
                <h5 className="mb-0">
                  Total: <span className="text-success fw-bold">${totalPrice.toFixed(2)}</span>
                  <small className="text-muted ms-2">({formData.selectedAccessories.length} items selected)</small>
                </h5>
              </div>
            )}

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success btn-lg">
                Purchase Accessories
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PurchaseAccessories;
