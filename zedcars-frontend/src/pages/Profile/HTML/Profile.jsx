import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { userApi } from '../../../api/userApi';
import '../CSS/Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user?.isAuthenticated) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await userApi.getProfile();
      setUserDetails(response.data);
      setEditForm(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await userApi.updateProfile(editForm);
      setUserDetails(editForm);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    try {
      await userApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setIsChangingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully!');
    } catch (error) {
      alert('Failed to change password');
    }
  };

  if (!user?.isAuthenticated) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  if (loading) {
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
            <span>{userDetails?.fullName?.charAt(0).toUpperCase()}</span>
          </div>
          <h1>User Profile</h1>
        </div>
        
        {!isEditing && !isChangingPassword ? (
          <div className="profile-content">
            <div className="profile-field">
              <label>Full Name</label>
              <span>{userDetails?.fullName || 'N/A'}</span>
            </div>
            
            <div className="profile-field">
              <label>Username</label>
              <span>{userDetails?.username}</span>
            </div>
            
            <div className="profile-field">
              <label>Email</label>
              <span>{userDetails?.email}</span>
            </div>
            
            <div className="profile-field">
              <label>Department</label>
              <span>{userDetails?.department || 'N/A'}</span>
            </div>
            
            <div className="profile-field">
              <label>Phone</label>
              <span>{userDetails?.phoneNumber || 'N/A'}</span>
            </div>
            
            <div className="profile-field">
              <label>Address</label>
              <span>{userDetails?.address || 'N/A'}</span>
            </div>
            
            <div className="profile-field">
              <label>Role</label>
              <span className={`role-badge ${userDetails?.role?.toLowerCase()}`}>
                {userDetails?.role}
              </span>
            </div>

            <div className="profile-actions">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
              <button className="password-btn" onClick={() => setIsChangingPassword(true)}>
                Change Password
              </button>
            </div>
          </div>
        ) : isEditing ? (
          <form onSubmit={handleEditSubmit} className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={editForm.fullName || ''}
                onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={editForm.phoneNumber || ''}
                onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={editForm.address || ''}
                onChange={(e) => setEditForm({...editForm, address: e.target.value})}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="profile-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">Change Password</button>
              <button type="button" className="cancel-btn" onClick={() => setIsChangingPassword(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
