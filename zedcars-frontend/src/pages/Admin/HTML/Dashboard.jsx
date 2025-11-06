import React, { useEffect, useState } from "react";
// import Chart from "chart.js/auto";
import apiClient from "../../../api/apiClient";
import "../CSS/dashboard.css";

const Dashboard = () => {
  
  const [dashboard, setDashboard] = useState(null);

  // ✅ Fetch dashboard data once on load
  useEffect(() => {
    apiClient
      .get("/admin/dashboard")
      .then((res) => setDashboard(res.data))
      .catch((err) => console.error("Error loading dashboard:", err));
  }, []);

  // ✅ Chart.js setup when data loads
  useEffect(() => {
    if (!dashboard) return;

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
        plugins: {
          title: { display: true, text: "Stock vs Units Sold" },
          legend: { position: "bottom" },
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Units" } },
        },
      },
    });

    return () => chart.destroy();
  }, [dashboard]);

  if (!dashboard) return <div className="loading">Loading Dashboard...</div>;
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  return (
    
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Dashboard</h1>
        <p className="lead">Manage your ZedCars inventory and analytics</p>

        <div className="admin-actions">
          <a href="/Admin/AddVehicle" className="btn btn-primary">Add Vehicle</a>
          <a href="/Admin/Inventory" className="btn btn-secondary">Manage Vehicles</a>
          <a href="/Accessory/Index" className="btn btn-secondary">Manage Accessories</a>
          <a href="/Admin/ManageUsers" className="btn btn-secondary">Manage Users</a>
          <a href="/Reports/SalesReport" className="btn btn-secondary">View Reports</a>
        </div>
      </header>

      <main className="container my-4">
        <section className="dashboard-overview">
          <h2>📊 Dashboard Overview</h2>
          <div className="row g-4">
            <DashboardCard icon="🚗" title="Total Vehicles" value={dashboard.totalCars} />
            <DashboardCard icon="✅" title="Available Cars" value={dashboard.activeVehicles} />
            <DashboardCard icon="💰" title="Car Inventory" value={`$${dashboard.vehiclePrice}`} />
            <DashboardCard icon="📈" title="Car Sales" value={`$${dashboard.totalSales.toFixed(2)}`} />
          </div>
        </section>

        <section className="analytics-section">
          <h2>Inventory Analytics</h2>
          <div className="analytics-grid">
            <div className="analytics-chart">
              <canvas id="stockSoldChart"></canvas>
            </div>
            <div className="analytics-metrics">
              <MetricCard title="Top Brand" value={dashboard.topBrandName} detail={`${dashboard.topBrandSalesPercent}% of sales`} />
              <MetricCard title="Avg Sale Price" value={`$${dashboard.averageSale.toFixed(2)}`} detail="Per transaction" />
              <MetricCard title="Units Sold" value={dashboard.unitsSold} detail="Total sold" />
            </div>
          </div>
        </section>

        <section className="admin-section">
          <h2>Recent Inventory</h2>
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Transmission</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Added Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentInventory?.map((car, i) => (
                <tr key={i}>
                  <td>{car.brand} {car.model}</td>
                  <td>{car.transmission}</td>
                  <td>{car.stockQuantity}</td>
                  <td>${car.price}</td>
                  <td>{new Date(car.createdDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

// 🔹 Reusable Components
const DashboardCard = ({ icon, title, value }) => (
  <div className="col-md-3">
    <div className="card shadow-sm border-1 rounded-3 h-100">
      <div className="card-body d-flex align-items-center">
        <div className="fs-1 me-3">{icon}</div>
        <div>
          <div className="fw-semibold text-muted">{title}</div>
          <div className="fs-4 fw-bold">{value}</div>
        </div>
      </div>
    </div>
  </div>
);

const MetricCard = ({ title, value, detail }) => (
  <div className="metric-card">
    <div className="metric-title">{title}</div>
    <div className="metric-value">{value}</div>
    <div className="metric-detail">{detail}</div>
  </div>
);

export default Dashboard;
