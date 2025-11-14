import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient';
import '../CSS/TestDrive.css';

const TestDrives = () => {
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTestDrives();
  }, []);

  const loadTestDrives = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/admin/testdrives');
      setTestDrives(response.data);
    } catch (err) {
      console.error('Error loading test drives:', err);
      setError('Failed to load test drives. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateTestDriveStatus = async (testDriveId, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this test drive as ${newStatus}?`)) {
      return;
    }

    try {
      await apiClient.post(`/admin/testdrives/${testDriveId}/status`, newStatus);
      await loadTestDrives();
      alert(`Test drive status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update test drive status. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'td-status-pending';
      case 'confirmed':
        return 'td-status-confirmed';
      case 'completed':
        return 'td-status-completed';
      case 'cancelled':
        return 'td-status-cancelled';
      default:
        return 'td-status-pending';
    }
  };

  const renderActionButtons = (testDrive) => {
    if (testDrive.status === 'Pending') {
      return (
        <div className="td-btn-group">
          <button
            className="td-btn td-btn-success"
            onClick={() => updateTestDriveStatus(testDrive.testDriveId, 'Confirmed')}
            title="Confirm"
          >
            ✓
          </button>
          <button
            className="td-btn td-btn-danger"
            onClick={() => updateTestDriveStatus(testDrive.testDriveId, 'Cancelled')}
            title="Cancel"
          >
            ✕
          </button>
        </div>
      );
    } else if (testDrive.status === 'Confirmed') {
      return (
        <div className="td-btn-group">
          <button
            className="td-btn td-btn-primary"
            onClick={() => updateTestDriveStatus(testDrive.testDriveId, 'Completed')}
            title="Mark Complete"
          >
            🏁
          </button>
          <button
            className="td-btn td-btn-danger"
            onClick={() => updateTestDriveStatus(testDrive.testDriveId, 'Cancelled')}
            title="Cancel"
          >
            ✕
          </button>
        </div>
      );
    } else {
      return <span className="td-no-actions">No actions</span>;
    }
  };

  if (loading) {
    return (
      <div className="test-drives-admin">
        <div className="td-loading">
          <div className="td-spinner"></div>
          <p>Loading test drives...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-drives-admin">
        <div className="td-error">
          <h3>Error</h3>
          <p>{error}</p>
          <button className="td-btn td-btn-primary" onClick={loadTestDrives}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="test-drives-admin">
      <div className="td-header">
        <div className="td-title-section">
          <h2 className="td-page-title">
            🚗 Test Drives Management
          </h2>
          <p className="td-page-subtitle">Manage all customer test drive bookings</p>
        </div>
        <button className="td-btn td-btn-primary" onClick={loadTestDrives}>
          🔄 Refresh
        </button>
      </div>

      <div className="td-card">
        <div className="td-card-header">
          <h3 className="td-card-title">All Test Drive Bookings</h3>
          <div className="td-stats">
            <span className="td-stat">
              Total: <strong>{testDrives.length}</strong>
            </span>
          </div>
        </div>

        <div className="td-card-body">
          {testDrives.length === 0 ? (
            <div className="td-no-data">
              <div className="td-no-data-icon">📅</div>
              <h4>No Test Drives Found</h4>
              <p>There are no test drive bookings at the moment.</p>
            </div>
          ) : (
            <div className="td-table-container">
              <table className="td-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Vehicle</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Booked On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testDrives.map((testDrive) => (
                    <tr key={testDrive.testDriveId} className="td-table-row">
                      <td>
                        <strong>#{testDrive.testDriveId}</strong>
                      </td>
                      <td>
                        <div className="td-customer-info">
                          <div className="td-customer-name">{testDrive.customerName}</div>
                          <div className="td-customer-email">{testDrive.customerEmail}</div>
                        </div>
                      </td>
                      <td>
                        <div className="td-contact-info">{testDrive.customerPhone}</div>
                      </td>
                      <td>
                        <div className="td-vehicle-info">
                          <div className="td-vehicle-name">
                            {testDrive.car ? `${testDrive.car.brand} ${testDrive.car.model}` : 'N/A'}
                          </div>
                          <div className="td-vehicle-year">
                            {testDrive.car ? testDrive.car.year : ''}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="td-date-time">
                          <div className="td-date">{formatDate(testDrive.bookingDate)}</div>
                          <div className="td-time">{testDrive.timeSlot}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`td-status-badge ${getStatusBadgeClass(testDrive.status)}`}>
                          {testDrive.status}
                        </span>
                      </td>
                      <td>
                        <div className="td-created-at">
                          {formatDateTime(testDrive.createdAt)}
                        </div>
                      </td>
                      <td>
                        {renderActionButtons(testDrive)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestDrives;
