import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import apiClient from "../../../api/apiClient";
import "../CSS/dashboard.css";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    apiClient
      .get("/admin/dashboard")
      .then((res) => {
        console.log("Dashboard data received:", res.data);
        setDashboard(res.data);
      })
      .catch((err) => console.error("Error loading dashboard:", err));
  }, []);

  useEffect(() => {
    if (!dashboard || !dashboard.stockData || !Array.isArray(dashboard.stockData)) return;

    const ctx = document.getElementById("stockSoldChart").getContext("2d");
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: dashboard.stockData.map((s) => s.brand),
        datasets: [
          {
            label: "Stock Available",
            data: dashboard.stockData.map((s) => s.stockAvailable),
            backgroundColor: "#2ecc71",
          },
          {
            label: "Units Sold",
            data: dashboard.stockData.map((s) => s.unitsSold),
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

        <div className="admin-actions d-flex justify-content-start align-items-center">
          <a href="/Admin/AddVehicle" className="btn btn-primary">Add New Vehicle</a>
          <a href="/Admin/Inventory" className="btn btn-secondary">Manage Vehicles</a>
          <a href="/Accessory/Index" className="btn btn-secondary">Manage Accessories</a>
          <a href="/Admin/ManageUsers" className="btn btn-secondary">Manage Users</a>
          <a href="/Reports/SalesReport" className="btn btn-secondary">View Reports</a>
        </div>
      </div>

      <div className="container my-4">
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

        <div className="user-activity-section">
          <div className="section-header d-flex justify-content-between align-items-center border-bottom">
            <h2 className="fw-bold text-primary mb-0">
              <i className="bi bi-activity me-2"></i> User Activity
            </h2>
            <a href="/Admin/UserActivity" className="view-all">View All</a>
          </div>
          <div className="activity-timeline p-3 bg-light">
            {dashboard.recentActivities && Array.isArray(dashboard.recentActivities) ? dashboard.recentActivities.map((activity, i) => (
              <div key={i} className="card mb-3 border-0 border-start border-4 border-primary shadow-sm">
                <div className="card-body d-flex">
                  <div className="fs-3 me-3">
                    {activity.activityType === "Registration" && "👤"}
                    {activity.activityType === "Test Drive" && "🚗"}
                    {activity.activityType === "Purchase" && "💰"}
                    {activity.activityType === "Accessory Purchase" && "🔧"}
                    {!["Registration", "Test Drive", "Purchase", "Accessory Purchase"].includes(activity.activityType) && "📝"}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 text-dark">{activity.activityType}</h5>
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {new Date(activity.activityDate).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="mb-1">
                      <strong className="text-primary">{activity.username}</strong>
                    </div>
                    <p className="mb-2 text-secondary">{activity.description}</p>
                    <span className={`badge ${activity.status === "Success" ? "bg-success" : activity.status === "Failed" ? "bg-danger" : "bg-warning text-dark"}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center text-muted py-5">
                <i className="bi bi-clock-history display-6 d-block mb-2"></i>
                <span>No recent activities found.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
