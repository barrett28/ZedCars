import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import "../CSS/Dashboard2.css";
import "../CSS/Dashboard.css";
// import car_logo from "../../../assets/images/dashboard/car-logo.png";
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


  // Render Stock VS Sold Chart
  useEffect(() => {
    if (
      activeTab !== "dashboard2" ||
      !dashboard ||
      !Array.isArray(dashboard.stockData)
    )
      return;


    const ctx = document
      .getElementById("stockSoldChart")
      .getContext("2d");


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
        plugins: {
          title: { display: true, text: "Stock Available vs Units Sold" },
          legend: { position: "bottom" },
        },
      },
    });


    return () => chart.destroy();
  }, [dashboard, activeTab, chartReload]);


  if (!dashboard)
    return <div className="loading">Loading Dashboard...</div>;


  return (
    <div className="container">
      {/* ------------ Header -------------- */}
      <div className="top-heading">
        {/* <img src={car_logo} alt="car_logo" /> */}
        {/* <img src="https://imgs.search.brave.com/OKGS_ha6ixdvaEnSdMWUOTOoqO0SwEbZ9TEABl3MKEs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wNy5o/aWNsaXBhcnQuY29t/L3ByZXZpZXcvODk5/LzEwMDgvODcxL2Nh/cnMtMi1saWdodG5p/bmctbWNxdWVlbi1t/YXRlci1waXhhci1j/YXJzLTMuanBn" alt=""  style={{backgroundColor: "transparent"}}/> */}
        <h1>Dashboard</h1>
      </div>


      {/* ------------ Navigation Buttons -------------- */}
      <div className="dashboard-navigation">
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



      {/* ------------ MAIN CONTENT AREA -------------- */}
      <div className="dashboard2-overview">
        {activeTab === "dashboard2" && (
          <>
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
       


            {/* ---------- Analytics Chart Section ---------- */}
            <div className="analytics-section mt-4">
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
              <div className="admin-section-responsive">
              <div className="section-header">
                <h2>Recent Inventory</h2>
                <a href="/Admin/Inventory" className="view-all">
                  View All
                </a>
              </div>


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
                  {dashboard.recentInventory?.length > 0 ? (
                    dashboard.recentInventory.map((car, i) => (
                      <tr key={i}>
                        <td>
                          {car.brand} {car.model}
                        </td>
                        <td>{car.transmission}</td>
                        <td>{car.stockQuantity}</td>
                        <td>${car.price}</td>
                        <td>
                          {new Date(car.createdDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No recent inventory</td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>


              {/* Recent Test Drives */}
              <div className="admin-section-responsive">
              <div className="section-header">
                <h2>Recent Test Drives</h2>
              </div>


              <table className="table table-bordered text-center">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Vehicle</th>
                    <th>Date</th>
                    <th>Phone</th>
                    <th>Timeslot</th>
                    <th>Status</th>
                  </tr>
                </thead>


                <tbody>
                  {dashboard.recentBookings?.length > 0 ? (
                    dashboard.recentBookings.map((td, i) => (
                      <tr key={i}>
                        <td>{td.customerName}</td>
                        <td>
                          {td.car?.brand} - {td.car?.model}
                        </td>
                        <td>
                          {new Date(td.bookingDate).toLocaleDateString()}
                        </td>
                        <td>{td.customerPhone}</td>
                        <td>{td.timeSlot}</td>
                        <td>{td.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No test drives found</td>
                    </tr>
                  )}
                </tbody>
              </table>
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




