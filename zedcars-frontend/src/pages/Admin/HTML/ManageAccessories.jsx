import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import "../CSS/ManageAccessories.css";

const ManageAccessories = () => {
  const navigate = useNavigate();
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [totalAccessories, setTotalAccessories] = useState(0);

  useEffect(() => {
    fetchAccessories(1);
  }, []);

  const fetchAccessories = async (page = 1) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await apiClient.get(`/accessory?page=${page}&limit=${pageSize}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data;
      setAccessories(data.accessories || data.data || data || []);
      setCurrentPage(data.currentPage || page);
      setTotalPages(data.totalPages || 1);
      setTotalAccessories(data.total || data.totalCount || (data.accessories?.length || 0));
    } catch (error) {
      console.error("Error fetching accessories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (e, page) => {
    e.preventDefault();
    if (page >= 1 && page <= totalPages) {
      setLoading(true);
      fetchAccessories(page);
    }
  };

  const handleEdit = (accessory) => {
    navigate(`/Admin/EditAccessories/${accessory.accessoryId}`, { state: { accessory } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this accessory?")) {
      try {
        const token = localStorage.getItem("jwtToken");
        await apiClient.delete(`/accessory/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchAccessories(currentPage);
      } catch (error) {
        console.error("Error deleting accessory:", error);
      }
    }
  };

  if (loading) return <div className="loading">Loading accessories...</div>;

  return (
    <div className="manage-accessories">
          <i className="fa-solid fa-car-side" style={{ transform: "rotate(-10deg)" }}></i>

      <div className="page-header">
        <h1>Manage Accessories</h1>
        <button className="btn btn-primary" onClick={() => navigate('/admin/add-accessory')}>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <>
          <nav className="admin-pagination-nav">
            <ul className="admin-pagination">
              <li className={`admin-page-item ${currentPage <= 1 ? "disabled" : ""}`}>
                <button
                  onClick={(e) => handlePageChange(e, currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  &laquo;
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`admin-page-item ${i + 1 === currentPage ? "active" : ""}`}
                >
                  <button onClick={(e) => handlePageChange(e, i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className={`admin-page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
                <button
                  onClick={(e) => handlePageChange(e, currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>

          <div className="admin-pagination-info">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, totalAccessories)} of {totalAccessories} accessories
          </div>
        </>
      )}
    </div>
  );
};

export default ManageAccessories;
