import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../api/apiClient";

const DeleteVehicle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await apiClient.get(`/admin/vehicles/${id}`);
        setVehicle(response.data);
      } catch (error) {
        console.error("Error fetching vehicle:", error);
        navigate("/Admin/AdminInventory");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id, navigate]);

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleting(true);
    try {
      await apiClient.delete(`/admin/vehicles/${id}`);
      navigate("/Admin/AdminInventory");
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Failed to delete vehicle");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading vehicle details...</div>;
  }

  if (!vehicle) {
    return <div className="error">Vehicle not found</div>;
  }

  return (
    <div className="delete-vehicle-page">
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-danger text-white">
                <h4 className="mb-0">Delete Vehicle</h4>
              </div>

              <div className="card-body">
                <h5 className="text-danger mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  Are you sure you want to delete this vehicle?
                </h5>
                <p className="mb-4">
                  This will <strong>soft delete</strong> the vehicle (it won't show in listings but remains in the database).
                </p>

                {/* Vehicle preview */}
                <div className="d-flex align-items-center mb-4">
                  <img
                    src={vehicle.imageUrl || "https://via.placeholder.com/120x80?text=No+Image"}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="img-thumbnail me-3"
                    style={{ width: "120px", height: "80px", objectFit: "cover" }}
                  />

                  <div>
                    <h5 className="mb-1">{vehicle.brand} {vehicle.model} ({vehicle.year})</h5>
                    <p className="text-muted mb-0">{vehicle.variant}</p>
                    <small className="text-secondary">
                      Price: ${vehicle.price?.toLocaleString()} | Stock: {vehicle.stockQuantity}
                    </small>
                  </div>
                </div>

                {/* Confirmation form */}
                <form onSubmit={handleDelete}>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-danger" disabled={deleting}>
                      <i className="bi bi-trash"></i> {deleting ? "Deleting..." : "Yes, Delete"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/Admin/AdminInventory")}
                      className="btn btn-secondary"
                    >
                      <i className="bi bi-x-circle"></i> Cancel
                    </button>
                  </div>
                </form>
              </div>

              <div className="card-footer text-muted small">
                Deleted by: Admin • {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 15px;
        }

        .mt-5 {
          margin-top: 3rem;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -15px;
        }

        .justify-content-center {
          justify-content: center;
        }

        .col-md-8 {
          flex: 0 0 66.666667%;
          max-width: 66.666667%;
          padding: 0 15px;
        }

        .card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
          word-wrap: break-word;
          background-color: #fff;
          background-clip: border-box;
          border: 1px solid rgba(0, 0, 0, 0.125);
          border-radius: 0.25rem;
        }

        .shadow-lg {
          box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
        }

        .border-0 {
          border: 0;
        }

        .card-header {
          padding: 0.75rem 1.25rem;
          margin-bottom: 0;
          background-color: rgba(0, 0, 0, 0.03);
          border-bottom: 1px solid rgba(0, 0, 0, 0.125);
        }

        .bg-danger {
          background-color: #dc3545;
        }

        .text-white {
          color: #fff;
        }

        .card-body {
          flex: 1 1 auto;
          padding: 1.25rem;
        }

        .text-danger {
          color: #dc3545;
        }

        .mb-0 {
          margin-bottom: 0;
        }

        .mb-1 {
          margin-bottom: 0.25rem;
        }

        .mb-3 {
          margin-bottom: 1rem;
        }

        .mb-4 {
          margin-bottom: 1.5rem;
        }

        .d-flex {
          display: flex;
        }

        .align-items-center {
          align-items: center;
        }

        .img-thumbnail {
          padding: 0.25rem;
          background-color: #fff;
          border: 1px solid #dee2e6;
          border-radius: 0.25rem;
          max-width: 100%;
          height: auto;
        }

        .me-3 {
          margin-right: 1rem;
        }

        .text-muted {
          color: #6c757d;
        }

        .text-secondary {
          color: #6c757d;
        }

        .gap-2 {
          gap: 0.5rem;
        }

        .btn {
          display: inline-block;
          font-weight: 400;
          line-height: 1.5;
          color: #212529;
          text-align: center;
          text-decoration: none;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
          background-color: transparent;
          border: 1px solid transparent;
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          border-radius: 0.25rem;
          transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .btn-danger {
          color: #fff;
          background-color: #dc3545;
          border-color: #dc3545;
        }

        .btn-danger:hover {
          color: #fff;
          background-color: #c82333;
          border-color: #bd2130;
        }

        .btn-secondary {
          color: #fff;
          background-color: #6c757d;
          border-color: #6c757d;
        }

        .btn-secondary:hover {
          color: #fff;
          background-color: #5a6268;
          border-color: #545b62;
        }

        .card-footer {
          padding: 0.75rem 1.25rem;
          background-color: rgba(0, 0, 0, 0.03);
          border-top: 1px solid rgba(0, 0, 0, 0.125);
        }

        .small {
          font-size: 0.875em;
        }

        .loading, .error {
          text-align: center;
          padding: 2rem;
          font-size: 1.2rem;
        }

        .error {
          color: #dc3545;
        }

        @media (max-width: 768px) {
          .col-md-8 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default DeleteVehicle;
