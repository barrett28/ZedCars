import React, { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";
import "../CSS/UserActivity.css";

const UserActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/admin/user-activities")
      .then((res) => {
        setActivities(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading user activities:", err);
        setLoading(false);
      });
  }, []);

  const mapIcon = (type) => {
    switch (type) {
      case "Registration":
        return { icon: "bi-person-plus", color: "success" };
      case "Test Drive":
        return { icon: "bi-car-front", color: "primary" };
      case "Purchase":
        return { icon: "bi-cart-check", color: "warning" };
      case "Accessory Purchase":
        return { icon: "bi-tools", color: "info" };
      default:
        return { icon: "bi-activity", color: "secondary" };
    }
  };

  if (loading) return <div className="loading">Loading User Activities...</div>;

  return (
    <div className="user-activity-page">
      <div className="page-header">
        <h1><i className="bi bi-activity me-2"></i>User Activities</h1>
        <p className="lead">Complete history of user activities</p>
      </div>

      <div className="activities-container">
        {activities.length > 0 ? (
          <div className="activities-grid">
            {activities.map((activity, i) => {
              const icon = mapIcon(activity.activityType);
              
              return (
                <div key={i} className="activity-card">
                  <div className={`activity-icon text-${icon.color}`}>
                    <i className={`bi ${icon.icon}`}></i>
                  </div>
                  
                  <div className="activity-content">
                    <div className="activity-header">
                      <h5 className="activity-type">{activity.activityType}</h5>
                      <span className="activity-date">
                        <i className="bi bi-clock me-1"></i>
                        {new Date(activity.activityDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    
                    <div className="activity-user">
                      <i className="bi bi-person me-1"></i>
                      <strong>{activity.username}</strong>
                    </div>
                    
                    <p className="activity-description">{activity.description}</p>
                    
                    <span className={`badge bg-${activity.status.toLowerCase() === "success" ? "success" : "danger"}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-activities">
            <i className="bi bi-inbox display-1 text-muted"></i>
            <h3 className="text-muted mt-3">No Activities Found</h3>
            <p className="text-muted">There are no user activities to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivity;
