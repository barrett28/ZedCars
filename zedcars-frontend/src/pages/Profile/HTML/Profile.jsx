import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { decodeJWT } from '../../../utils/jwtUtils';
import '../CSS/Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decoded = decodeJWT(token);
      setUserDetails({
        username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'N/A',
        email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || 'N/A',
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'N/A',
        userId: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 'N/A'
      });
    }
  }, []);

  if (!user?.isAuthenticated) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{userDetails.username.charAt(0).toUpperCase()}</span>
          </div>
          <h1>User Profile</h1>
        </div>
        
        <div className="profile-content">
          <div className="profile-field">
            <label>Username</label>
            <span>{userDetails.username}</span>
          </div>
          
          <div className="profile-field">
            <label>Email</label>
            <span>{userDetails.email}</span>
          </div>
          
          <div className="profile-field">
            <label>Role</label>
            <span className={`role-badge ${userDetails.role.toLowerCase()}`}>
              {userDetails.role}
            </span>
          </div>
          
          <div className="profile-field">
            <label>User ID</label>
            <span>{userDetails.userId}</span>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            className="edit-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
