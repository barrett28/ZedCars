import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import "../CSS/Dashboard2.css";
import "../CSS/Dashboard.css";
// import car_logo from "../../../assets/images/dashboard/car-logo.png";
import AdminInventory from "./AdminInventory";
import ManageAccessories from "./ManageAccessories";
import ManageUsers from "./Users/ManageUsers";
import Reports from "./Reports";
import apiClient from "../../../api/apiClient";
import { useAuth } from "../../../context/AuthContext";

const Dashboard2 = () => {
  const [activeTab, setActiveTab] = useState("dashboard2");
  const [dashboard, setDashboard] = useState(null);
  const [chartReload, setChartReload] = useState(0);
  const { user } = useAuth();

  // Fetch Dashboard Data
  useEffect(() => {
    apiClient
      .get("/admin/dashboard")
      .then((res) => {
        setDashboard(res.data);
      })
      .catch((error) => {
        console.error("Error loading dashboard data.", error);
      });
  }, []);

  useEffect(() => {
    const activeBtn = document.querySelector(".nav-items .active");
    const nav = document.querySelector(".nav-items");

    if (activeBtn && nav) {
      nav.style.setProperty("--indicator-left", activeBtn.offsetLeft + "px");
      nav.style.setProperty("--indicator-width", activeBtn.offsetWidth + "px");
    }
  }, [activeTab]);

  // Render Stock VS Sold Chart
  useEffect(() => {
    if (
      activeTab !== "dashboard2" ||
      !dashboard ||
      !Array.isArray(dashboard.stockData)
    )
      return;

    const ctx = document.getElementById("stockSoldChart").getContext("2d");

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: dashboard.stockData.map((s) => s.brand),
        datasets: [
          {
            label: "Stock Available",
            data: dashboard.stockData.map((s) => s.stockAvailable || 0),
            backgroundColor: "#2ebe3a",
          },
          {
            label: "Units Sold",
            data: dashboard.stockData.map((s) => s.unitsSold || 0),
            backgroundColor: "#e73939",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: "Stock Available vs Units Sold" },
          legend: { position: "bottom" },
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 0,
            },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [dashboard, activeTab, chartReload]);

  if (!dashboard) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div className="container">
      {/* ------------ Header -------------- */}
      <div className="top-heading">
        <h1>Dashboard</h1>

        {/* ----------- New Modern Navigation Strip ----------- */}
        <div className="nav-strip">
          <div className="nav-items">
            <button
              className={activeTab === "dashboard2" ? "active" : ""}
              onClick={() => {
                setActiveTab("dashboard2");
                setChartReload((prev) => prev + 1);
              }}
            >
              Overview
            </button>

            {(user.role === "SuperAdmin" || user.role === "Manager") && (
              <>
                <button
                  className={activeTab === "inventory" ? "active" : ""}
                  onClick={() => setActiveTab("inventory")}
                >
                  Vehicle
                </button>

                <button
                  className={activeTab === "accessories" ? "active" : ""}
                  onClick={() => setActiveTab("accessories")}
                >
                  Accessories
                </button>
              </>
            )}

            {user.role === "SuperAdmin" && (
              <button
                className={activeTab === "users" ? "active" : ""}
                onClick={() => setActiveTab("users")}
              >
                Users
              </button>
            )}

            <button
              className={activeTab === "report" ? "active" : ""}
              onClick={() => setActiveTab("report")}
            >
              View Report
            </button>
          </div>
        </div>
      </div>

      {/* ------------ MAIN CONTENT AREA -------------- */}
      <div className="dashboard2-overview">
        {activeTab === "dashboard2" && (
          <>
            <div className="dashboard-grid-container">
              <h2 className="mb-4">📊 Dashboard Overview</h2>

              <div className="dashboard-grid">
                <div className="grid-card">
                  <i className="bi bi-car-front-fill text-primary fs-1"></i>
                  <div>
                    <p className="label">Total Vehicles</p>
                    <h3 className="value">{dashboard.totalCars || 0}</h3>
                  </div>
                </div>

                <div className="grid-card">
                  <i className="bi bi-check-circle-fill text-info fs-1"></i>
                  <div>
                    <p className="label">Available Cars</p>
                    <h3 className="value">{dashboard.activeVehicles || 0}</h3>
                  </div>
                </div>

                <div className="grid-card">
                  <i className="bi bi-cash-stack text-success fs-1"></i>
                  <div>
                    <p className="label">Car Inventory</p>
                    <h3 className="value">${dashboard.vehiclePrice || 0}</h3>
                  </div>
                </div>

                <div className="grid-card">
                  <i className="bi bi-currency-dollar text-success fs-1"></i>
                  <div>
                    <p className="label">Car Sales</p>
                    <h3 className="value">
                      ${(dashboard.totalSales || 0).toFixed(2)}
                    </h3>
                  </div>
                </div>

                <div className="grid-card">
                  <i className="bi bi-grid-fill text-success fs-1"></i>
                  <div>
                    <p className="label">Vehicle Brands</p>
                    <h3 className="value">8</h3>
                  </div>
                </div>

                <div className="grid-card">
                  <i className="bi bi-people-fill text-warning fs-1"></i>
                  <div>
                    <p className="label">Total Users</p>
                    <h3 className="value">{dashboard.totalUsers || 0}</h3>
                  </div>
                </div>

                <div className="grid-card">
                  <i className="bi bi-box-seam-fill text-danger fs-1"></i>
                  <div>
                    <p className="label">Accessory Inventory</p>
                    <h3 className="value">
                      ${dashboard.accessoriesTotal || 0}
                    </h3>
                  </div>
                </div>

                <div className="grid-card">
                  <i className="bi bi-graph-up-arrow text-danger fs-1"></i>
                  <div>
                    <p className="label">Accessory Sales</p>
                    <h3 className="value">
                      ${dashboard.accessoriesSales || 0}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------- Analytics Chart Section ---------- */}
            <div className="analytics-section mt-4 d-flex flex-column">
              <h2>Inventory Analytics</h2>

              <div className="analytics-grid">
                <div className="analytics-chart">
                  <canvas id="stockSoldChart"></canvas>
                </div>

                <div className="analytics-metrics">
                  <div className="metric-card">
                    <div className="metric-title">Top Selling Brand</div>
                    <div className="metric-value">
                      {dashboard.topBrandName || "N/A"}
                    </div>
                    <div className="metric-detail">
                      {dashboard.topBrandSalesPercent || 0}% of total sales
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-title">Average Sale Price</div>
                    <div className="metric-value">
                      ${(dashboard.averageSale || 0).toFixed(2)}
                    </div>
                    <div className="metric-detail">Per vehicle</div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-title">Total Units Sold</div>
                    <div className="metric-value">
                      {dashboard.unitsSold || 0}
                    </div>
                    <div className="metric-detail">This period</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-table-main">
              {/* Recent Inventory Section */}
              {/* ==================== RECENT INVENTORY TABLE ==================== */}
              <div className="admin-section-responsive">
                <div className="section-header">
                  <h2>Recent Inventory</h2>
                  <a href="/Admin/AdminInventory" className="view-all">
                    View All →
                  </a>
                </div>

                <div className="table-responsive-wrapper">
                  <table className="admin-table">
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
                      {dashboard.recentInventory?.length > 0 ? (
                        dashboard.recentInventory.map((car, i) => (
                          <tr key={i}>
                            <td data-label="Vehicle">
                              <strong>
                                {car.brand} {car.model}
                              </strong>
                            </td>
                            <td data-label="Transmission">
                              {car.transmission}
                            </td>
                            <td data-label="Quantity">
                              <span className="badge-stock">
                                {car.stockQuantity}
                              </span>
                            </td>
                            <td data-label="Price">
                              <strong className="text-success">
                                ${Number(car.price).toLocaleString()}
                              </strong>
                            </td>
                            <td data-label="Added Date">
                              {new Date(car.createdDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="no-data">
                            No recent inventory added
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ==================== RECENT TEST DRIVES TABLE ==================== */}
              <div className="admin-section-responsive">
                <div className="section-header">
                  <h2>Recent Test Drives</h2>
                  <a href="/Admin/TestDrives" className="view-all">
                    View All →
                  </a>
                </div>

                <div className="table-responsive-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Vehicle</th>
                        <th>Date</th>
                        <th>Phone</th>
                        <th>Time Slot</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.recentBookings?.length > 0 ? (
                        dashboard.recentBookings.map((booking, i) => (
                          <tr key={i}>
                            <td data-label="Customer">
                              <div className="customer-name">
                                {booking.customerName}
                              </div>
                            </td>
                            <td data-label="Vehicle">
                              {booking.car?.brand} {booking.car?.model}
                            </td>
                            <td data-label="Date">
                              {new Date(booking.bookingDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </td>
                            <td data-label="Phone">{booking.customerPhone}</td>
                            <td data-label="Time Slot">{booking.timeSlot}</td>
                            <td data-label="Status">
                              <span
                                className={`status-badge status-${booking.status.toLowerCase()}`}
                              >
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="no-data">
                            No recent test drives
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent User Activity */}
            <div className="user-activity-section refined">
              <div className="ua-header">
                <h2>
                  <i className="bi bi-activity me-2"></i> Latest Activity
                </h2>
                <a href="/Admin/UserActivity" className="ua-view-all">
                  View All
                </a>
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
                            <h6 className="ua-title">
                              {activity.activityType}
                            </h6>
                            <small className="ua-time">
                              <i className="bi bi-clock me-1"></i>
                              {new Date(
                                activity.activityDate
                              ).toLocaleDateString("en-US", {
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
                    <p className="text-muted mt-2">
                      No recent activities found.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ---------- TABS COMPONENT RENDERS ---------- */}

        {activeTab === "inventory" && <AdminInventory />}

        {activeTab === "accessories" && <ManageAccessories />}

        {activeTab === "users" && <ManageUsers />}

        {activeTab === "report" && <Reports />}
      </div>
    </div>
  );
};

export default Dashboard2;
