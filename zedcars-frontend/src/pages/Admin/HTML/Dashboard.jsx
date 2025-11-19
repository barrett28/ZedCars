import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import apiClient from "../../../api/apiClient";
import "../CSS/Dashboard.css";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    apiClient
      .get("/admin/dashboard")
      .then((res) => {
        setDashboard(res.data);
      })
      .catch((err) => console.error("Error loading dashboard:", err));
  }, []);

  useEffect(() => {
    if (!dashboard || !dashboard.stockData || !Array.isArray(dashboard.stockData)) {
      return;
    }
    
    const ctx = document.getElementById("stockSoldChart").getContext("2d");
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: dashboard.stockData.map((s) => s.brand),
        datasets: [
          {
            label: "Stock Available",
            data: dashboard.stockData.map((s) => s.stockAvailable || 0),
            backgroundColor: "#2ecc71",
          },
          {
            label: "Units Sold", 
            data: dashboard.stockData.map((s) => s.unitsSold || 0),
            backgroundColor: "#e74c3c",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: "Stock Available vs Units Sold by Brand" },
          legend: { position: "bottom" },
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Number of Units" } },
        },
      },
    });

    return () => chart.destroy();
  }, [dashboard]);

  if (!dashboard) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header p-4">
        <h1>Dashboard</h1>
        <p className="lead">Manage your ZedCars inventory and users</p>

         <div className="admin-actions">
          <a href="/Admin/AddVehicle" className="action-btn primary">
            <i className="bi bi-plus-circle"></i>
            <span>Add Vehicle</span>
          </a>
          <a href="/Admin/AdminInventory" className="action-btn">
            <i className="bi bi-car-front"></i>
            <span>Manage Vehicles</span>
          </a>
          <a href="/Admin/ManageAccessories" className="action-btn">
            <i className="bi bi-tools"></i>
            <span>Accessories</span>
          </a>
          <a href="/Admin/Users" className="action-btn">
            <i className="bi bi-people"></i>
            <span>Users</span>
          </a>
          <a href="/Admin/Reports" className="action-btn">
            <i className="bi bi-graph-up"></i>
            <span>Reports</span>
          </a>
        </div>
      </div>
    
      <div className="my-4">
        <div className="dashboard-overview">
          <h2 className="mb-4">📊 Dashboard Overview</h2>

          <div className="row g-4">
            <div className="col-md-3">
              <div className="card shadow-sm border-1 rounded-3 h-100">
                <div className="card-body d-flex align-items-center">
                  <i className="bi bi-car-front-fill text-primary fs-1 me-3"></i>
                  <div>
                    <div className="fw-semibold text-muted">Total Vehicles</div>
                    <div className="fs-4 fw-bold">{dashboard.totalCars || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-1 rounded-3 h-100">
                <div className="card-body d-flex align-items-center">
                  <i className="bi bi-check-circle-fill text-info fs-1 me-3"></i>
                  <div>
                    <div className="fw-semibold text-muted">Available Cars</div>
                    <div className="fs-4 fw-bold">{dashboard.activeVehicles || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-1 rounded-3 h-100">
                <div className="card-body d-flex align-items-center">
                  <i className="bi bi-cash-stack text-success fs-1 me-3"></i>
                  <div>
                    <div className="fw-semibold text-muted">Car Inventory</div>
                    <div className="fs-4 fw-bold">${dashboard.vehiclePrice || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-1 rounded-3 h-100">
                <div className="card-body d-flex align-items-center">
                  <i className="bi bi-currency-dollar text-success fs-1 me-3"></i>
                  <div>
                    <div className="fw-semibold text-muted">Car Sales</div>
                    <div className="fs-4 fw-bold">${(dashboard.totalSales || 0).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-2">
            <div className="col-md-3">
              <div className="card text-center shadow-sm border-1 rounded-3 h-100">
                <div className="card-body">
                  <div className="fs-3 fw-bold text-success">8</div>
                  <div className="text-muted">Vehicle Brands</div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-1 rounded-3 h-100">
                <div className="card-body d-flex align-items-center">
                  <i className="bi bi-people-fill text-warning fs-1 me-3"></i>
                  <div>
                    <div className="fs-4 fw-bold">{dashboard.totalUsers || 0}</div>
                    <div className="fw-semibold text-muted">Total Users</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card text-center shadow-sm border-1 rounded-3 h-100">
                <div className="card-body">
                  <div className="fs-3 fw-bold text-danger">${dashboard.accessoriesTotal || 0}</div>
                  <div className="text-muted">Accessory Inventory</div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card text-center shadow-sm border-1 rounded-3 h-100">
                <div className="card-body">
                  <div className="fs-3 fw-bold text-danger">${dashboard.accessoriesSales || 0}</div>
                  <div className="text-muted">Accessory Sales</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-section mt-4">
          <h2>Inventory Analytics</h2>
          <div className="analytics-grid">
            <div className="analytics-chart">
              <canvas id="stockSoldChart"></canvas>
            </div>
            <div className="analytics-metrics">
              <div className="metric-card">
                <div className="metric-title">Top Selling Brand</div>
                <div className="metric-value">{dashboard.topBrandName || "N/A"}</div>
                <div className="metric-detail">{dashboard.topBrandSalesPercent || 0}% of total sales</div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Average Sale Price</div>
                <div className="metric-value">${(dashboard.averageSale || 0).toFixed(2)}</div>
                <div className="metric-detail">Per vehicle transaction</div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Total Units Sold</div>
                <div className="metric-value">{dashboard.unitsSold || 0}</div>
                <div className="metric-detail">Vehicles sold this period</div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-section">
            <div className="section-header">
              <h2>Recent Inventory</h2>
              <a href="/Admin/Inventory" className="view-all">View All</a>
            </div>
            <div className="admin-table">
              <table className="table table-bordered text-center">
                <thead className="table-light">
                  <tr>
                    <th>Vehicle</th>
                    <th>Transmission</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Added Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentInventory && Array.isArray(dashboard.recentInventory) ? dashboard.recentInventory.map((car, i) => (
                    <tr key={i}>
                      <td>{car.brand} {car.model}</td>
                      <td>{car.transmission}</td>
                      <td>{car.stockQuantity}</td>
                      <td>${car.price}</td>
                      <td>{new Date(car.createdDate).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5">No recent inventory data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-section">
            <div className="section-header">
              <h2>Recent Test Drives</h2>
            </div>
            <div className="admin-table">
              <table className="table table-bordered text-center">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Vehicle</th>
                    <th>Date</th>
                    <th>Phone Number</th>
                    <th>Time Slot</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentBookings && Array.isArray(dashboard.recentBookings) ? dashboard.recentBookings.map((td, i) => (
                    <tr key={i}>
                      <td>{td.customerName}</td>
                      <td>{td.car?.brand} - {td.car?.model}</td>
                      <td>{new Date(td.bookingDate).toLocaleDateString()}</td>
                      <td>{td.customerPhone}</td>
                      <td>{td.timeSlot}</td>
                      <td>{td.status}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6">No recent test drives available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

       <div className="user-activity-section refined">
        <div className="ua-header">
          <h2><i className="bi bi-activity me-2"></i> Latest Activity</h2>
          <a href="/Admin/UserActivity" className="ua-view-all">View All</a>
        </div>

  <div className="ua-grid">
    {dashboard.recentActivities?.length > 0 ? (

      dashboard.recentActivities.map((activity, i) => {
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

        const icon = mapIcon(activity.activityType);

        return (
          <div key={i} className="ua-card">
            <div className={`ua-icon text-${icon.color}`}>
              <i className={`bi ${icon.icon}`}></i>
            </div>

            <div className="ua-body">
              <div className="ua-title-row">
                <h6 className="ua-title">{activity.activityType}</h6>
                <small className="ua-time">
                  <i className="bi bi-clock me-1"></i>
                  {new Date(activity.activityDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>

              <div className="ua-user">
                <i className="bi bi-person me-1"></i>
                {activity.username}
              </div>

              <p className="ua-desc">{activity.description}</p>

              <span
                className={`badge bg-${
                  activity.status.toLowerCase() === "success"
                    ? "success"
                    : "danger"
                }`}
              >
                {activity.status}
              </span>
            </div>
          </div>
        );
      })

    ) : (
      <div className="ua-empty">
        <i className="bi bi-inbox display-4 text-muted"></i>
        <p className="text-muted mt-2">No recent activities found.</p>
      </div>
    )}
  </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
