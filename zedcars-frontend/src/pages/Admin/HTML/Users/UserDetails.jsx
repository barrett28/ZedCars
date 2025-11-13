import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../../api/apiClient";
import "../../CSS/UserDetails.css";

const UserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await apiClient.get(`/admin/users/${id}`);
      setUser(response.data);
    } catch (err) {
      alert("Failed to load user data");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading user details...</div>;
  if (!user) return <div className="error">User not found</div>;

  return (
    <div className="user-details-container">
      <div className="details-header">
        <h2>User Details</h2>
        <div className="header-actions">
          <button 
            className="edit-btn"
            onClick={() => navigate(`/admin/users/edit/${user.adminId}`)}
          >
            Edit User
          </button>
          <button 
            className="back-btn"
            onClick={() => navigate("/admin/users")}
          >
            Back to Users
          </button>
        </div>
      </div>

      <div className="details-content">
        <div className="details-card">
          <h3>Basic Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <label>User ID:</label>
              <span>{user.adminId}</span>
            </div>
            <div className="detail-item">
              <label>Username:</label>
              <span>{user.username}</span>
            </div>
            <div className="detail-item">
              <label>Full Name:</label>
              <span>{user.fullName}</span>
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="detail-item">
              <label>Role:</label>
              <span className={`role-badge ${user.role.toLowerCase()}`}>
                {user.role}
              </span>
            </div>
            <div className="detail-item">
              <label>Status:</label>
              <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="details-card">
          <h3>Contact Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <label>Phone Number:</label>
              <span>{user.phoneNumber || 'Not provided'}</span>
            </div>
            <div className="detail-item">
              <label>Department:</label>
              <span>{user.department || 'Not assigned'}</span>
            </div>
            <div className="detail-item full-width">
              <label>Address:</label>
              <span>{user.address || 'Not provided'}</span>
            </div>
          </div>
        </div>

        <div className="details-card">
          <h3>Account Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <label>Created Date:</label>
              <span>{new Date(user.createdDate).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <label>Modified Date:</label>
              <span>{new Date(user.modifiedDate).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <label>Last Login:</label>
              <span>
                {user.lastLoginDate 
                  ? new Date(user.lastLoginDate).toLocaleDateString()
                  : 'Never logged in'
                }
              </span>
            </div>
            <div className="detail-item">
              <label>Permissions:</label>
              <span>{user.permissions || 'Default permissions'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
