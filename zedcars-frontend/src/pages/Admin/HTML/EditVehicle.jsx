import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import "../CSS/AddVehicle.css";

const EditVehicle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Form data state
  const [formData, setFormData] = useState({
    carId: "",
    brand: "",
    model: "",
    variant: "",
    year: "",
    price: "",
    stockQuantity: "",
    color: "",
    fuelType: "",
    transmission: "",
    mileage: "",
    description: "",
    imageUrl: ""
  });

  // UI states
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Multi-image handling states
  const [imageUrls, setImageUrls] = useState([]); // Array of image URLs for preview
  const [urlInput, setUrlInput] = useState(""); // Textarea input for adding new URLs

  // Clean and validate URL
  const cleanUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    
    let cleanedUrl = url.trim();
    
    // Fix common URL issues
    if (cleanedUrl.startsWith('tps://')) {
      cleanedUrl = 'h' + cleanedUrl;
    }
    if (cleanedUrl.startsWith('ttps://')) {
      cleanedUrl = 'h' + cleanedUrl;
    }
    
    // Validate URL format
    if (cleanedUrl.startsWith('http://') || cleanedUrl.startsWith('https://')) {
      return cleanedUrl;
    }
    
    return null;
  };

  // Load vehicle data on component mount
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        console.log("Fetching vehicle with ID:", id);
        const response = await apiClient.get(`/admin/vehicles/${id}`);
        console.log("Vehicle data received:", response.data);
        const vehicle = response.data;
        
        // Set form data with proper field mapping
        setFormData({
          carId: vehicle.carId || vehicle.id,
          brand: vehicle.brand || vehicle.Brand || "",
          model: vehicle.model || vehicle.Model || "",
          variant: vehicle.variant || vehicle.Variant || "",
          year: vehicle.year || vehicle.Year || "",
          price: vehicle.price || vehicle.Price || "",
          stockQuantity: vehicle.stockQuantity || vehicle.StockQuantity || "",
          color: vehicle.color || vehicle.Color || "",
          fuelType: vehicle.fuelType || vehicle.FuelType || "",
          transmission: vehicle.transmission || vehicle.Transmission || "",
          mileage: vehicle.mileage || vehicle.Mileage || "",
          description: vehicle.description || vehicle.Description || "",
          imageUrl: vehicle.imageUrl || vehicle.ImageUrl || ""
        });

        // Parse existing images from database
        const existingImageUrl = vehicle.imageUrl || vehicle.ImageUrl || "";
        console.log("Raw imageUrl from database:", existingImageUrl);
        
        if (existingImageUrl) {
          try {
            // Try to parse as JSON array first
            const parsedUrls = JSON.parse(existingImageUrl);
            if (Array.isArray(parsedUrls)) {
              // Clean and filter valid URLs
              const cleanUrls = parsedUrls
                .map(url => cleanUrl(url))
                .filter(url => url !== null);
              setImageUrls(cleanUrls);
              console.log("Parsed and cleaned image URLs:", cleanUrls);
            } else {
              // Single URL
              const cleaned = cleanUrl(parsedUrls);
              setImageUrls(cleaned ? [cleaned] : []);
            }
          } catch (parseError) {
            console.log("JSON parse failed, checking for malformed JSON...");
            
            // Handle malformed JSON (missing opening bracket)
            if (existingImageUrl.includes('",') && !existingImageUrl.startsWith('[')) {
              try {
                const fixedJson = '[' + existingImageUrl;
                const parsedUrls = JSON.parse(fixedJson);
                setImageUrls(Array.isArray(parsedUrls) ? parsedUrls : [parsedUrls]);
                console.log("Fixed malformed JSON, parsed URLs:", parsedUrls);
              } catch (fixError) {
                console.log("Could not fix malformed JSON, treating as single URL");
                setImageUrls([existingImageUrl]);
              }
            } else {
              // Treat as single URL
              console.log("Treating as single URL");
              setImageUrls([existingImageUrl]);
            }
          }
        } else {
          setImageUrls([]);
        }
        
      } catch (error) {
        console.error("Error fetching vehicle:", error);
        setMessage({ type: "error", text: "Failed to load vehicle details." });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "color") {
      // Only allow letters and spaces for color
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData({ ...formData, [name]: lettersOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add a single image URL to the preview
  const addImageFromUrl = (url) => {
    url = url.trim();
    if (!url || imageUrls.includes(url)) return;

    // Validate image URL by loading it
    const img = new Image();
    img.onload = () => {
      const newImageUrls = [...imageUrls, url];
      setImageUrls(newImageUrls);
      // Update formData with JSON string
      setFormData(prev => ({ ...prev, imageUrl: JSON.stringify(newImageUrls) }));
      console.log("Added image URL:", url);
      console.log("Updated imageUrls:", newImageUrls);
    };
    img.onerror = () => {
      alert(`Failed to load image: ${url}`);
    };
    img.src = url;
  };

  // Add multiple image URLs from textarea input
  const handleAddImages = () => {
    const text = urlInput.trim();
    if (!text) return;

    // Split by newlines, commas, or spaces and filter empty strings
    const urls = text.split(/\s+|,|\n/).filter(Boolean);
    urls.forEach(addImageFromUrl);
    setUrlInput(""); // Clear input after adding
  };

  // Remove an image from the preview
  const removeImage = (urlToRemove) => {
    const newImageUrls = imageUrls.filter((u) => u !== urlToRemove);
    setImageUrls(newImageUrls);
    // Update formData with JSON string
    setFormData(prev => ({ ...prev, imageUrl: JSON.stringify(newImageUrls) }));
    console.log("Removed image:", urlToRemove);
    console.log("Updated imageUrls:", newImageUrls);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Prepare data for backend with proper field mapping
      const backendData = {
        carId: formData.carId,
        Brand: formData.brand,
        Model: formData.model,
        Variant: formData.variant,
        Year: formData.year,
        Price: parseFloat(formData.price),
        StockQuantity: parseInt(formData.stockQuantity) || 0,
        Color: formData.color,
        FuelType: formData.fuelType,
        Transmission: formData.transmission,
        Mileage: parseInt(formData.mileage) || 0,
        Description: formData.description,
        ImageUrl: imageUrls.length > 0 ? JSON.stringify(imageUrls) : "",
      };

      console.log("Submitting data:", backendData);
      console.log("ImageUrls array:", imageUrls);
      console.log("ImageUrl being sent:", backendData.ImageUrl);
      
      await apiClient.put(`/admin/vehicles/${id}`, backendData);
      setMessage({ type: "success", text: "Vehicle updated successfully!" });
      setTimeout(() => navigate("/Admin/AdminInventory"), 2000);
      
    } catch (error) {
      console.error("Error updating vehicle:", error);
      setMessage({ type: "error", text: "Failed to update vehicle. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading vehicle details...</div>;

  return (
    <div className="admin-add-vehicle-page">
      <header className="admin-header">
        <h1>Edit Vehicle</h1>
        <p>Edit an existing vehicle in your inventory.</p>
        <div className="admin-actions">
          <button onClick={() => navigate("/Admin/Dashboard")} className="admin-btn admin-btn-secondary">
            Back to Dashboard
          </button>
          <button onClick={() => navigate("/Admin/AdminInventory")} className="admin-btn admin-btn-secondary">
            View Inventory
          </button>
        </div>
      </header>

      {message.text && (
        <div className={`admin-alert ${message.type === "success" ? "admin-alert-success" : "admin-alert-danger"}`}>
          {message.text}
        </div>
      )}

      <div className="admin-form-container">
        <form onSubmit={handleSubmit} id="admin-vehicle-form">
          <div className="admin-grid">
            
            {/* LEFT COLUMN - Basic Details */}
            <div className="admin-form-column">
              <h3>Basic Details</h3>
              <input type="hidden" name="carId" value={formData.carId} />

              <div className="admin-form-group">
                <label>Brand</label>
                <select name="brand" value={formData.brand} onChange={handleChange} required>
                  <option value="">Select Brand</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Ford">Ford</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes">Mercedes</option>
                  <option value="Tesla">Tesla</option>
                  <option value="Audi">Audi</option>
                  <option value="Lexus">Lexus</option>
                  <option value="Jeep">Jeep</option>
                  <option value="Chevrolet">Chevrolet</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Model</label>
                <input type="text" name="model" value={formData.model} onChange={handleChange} required />
              </div>

              <div className="admin-form-group">
                <label>Variant</label>
                <input type="text" name="variant" value={formData.variant} onChange={handleChange} />
              </div>

              <div className="admin-form-group">
                <label>Year</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} min="1900" max="2030" />
              </div>

              <div className="admin-form-group">
                <label>Price ($)</label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} min="0" required />
              </div>

              <div className="admin-form-group">
                <label>Stock Quantity</label>
                <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} min="0" />
              </div>

              <div className="admin-form-group">
                <label>Color</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} />
              </div>

              <div className="admin-form-group">
                <label>Fuel Type</label>
                <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
                  <option value="">Select Fuel Type</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Transmission</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange}>
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Mileage (MPG)</label>
                <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} min="0" />
              </div>
            </div>

            {/* RIGHT COLUMN - Images & Description */}
            <div className="admin-form-column">
              <h3>Images & Description</h3>

              {/* Multi-Image URL Input Section */}
              <div className="admin-form-group">
                <label>Vehicle Images (URLs)</label>
                <div className="url-input-zone">
                  <p>Paste one or more image URLs (line-by-line, comma, or space separated)</p>

                  <textarea
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/car1.jpg&#10;https://example.com/car2.png"
                    rows="4"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleAddImages();
                      }
                    }}
                  />

                  <button type="button" onClick={handleAddImages} className="add-images-btn">
                    Add Images
                  </button>
                </div>
              </div>

              {/* Image Preview Section */}
              {imageUrls.length > 0 && (
                <div className="preview-container">
                  <h4>Image Previews ({imageUrls.length}):</h4>
                  {imageUrls.map((url, index) => (
                    <div key={index} className="image-preview">
                      <img src={url} alt={`Preview ${index + 1}`} />
                      <button type="button" className="remove-btn" onClick={() => removeImage(url)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* URL List Section */}
              {imageUrls.length > 0 && (
                <div className="url-list">
                  <h4>Current URLs ({imageUrls.length}):</h4>
                  <div className="url-items">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="url-item">
                        {index + 1}. {url}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description Section */}
              <div className="admin-form-group mt-3">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Enter vehicle description..."
                />
              </div>

              {/* Form Actions */}
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? "Updating..." : "Update Vehicle"}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => navigate("/Admin/AdminInventory")}
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicle;
