import React, { useState } from 'react';
import Chart from "chart.js/auto";
import '../CSS/Dashboard2.css';
import car_logo from '../../../assets/images/zedcar_logo.png';
import AdminInventory from './AdminInventory';
import ManageAccessories from './ManageAccessories';
import ManageUsers from './Users/ManageUsers';
import Reports from './Reports';
import { useEffect } from 'react';
import apiClient from '../../../api/apiClient';


const Dashboard2 = () => {

  const [activeTab, setActiveTab] = useState("dashboard2")
  const [dashboard, setDashboard] = useState(null);
  const [chartReload, setchartReload] = useState(0);

  useEffect(()=>{
    apiClient.get("/admin/dashboard").then((res)=>{
      setDashboard(res.data);
    }).catch((error)=>{
      console.error("Error in loading data.",error);
    });
  },[]);

  useEffect(() => {
    if (!dashboard || !dashboard.stockData || !Array.isArray(dashboard.stockData)) {
      return;
    }
    if (activeTab !== "dashboard2" || !dashboard?.stockData) return;
    
    const ctx = document.getElementById("stockSoldChart").getContext("2d");
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: dashboard.stockData.map((s) => s.brand),
        datasets: [
          {
            label: "Stock Available",
            data: dashboard.stockData.map((s) => s.stockAvailable || 0),
            backgroundColor: "#ffc1a0ff",
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
          title: { display: true, text: "Stock Available vs Units Sold by Brand" },
          legend: { position: "bottom" },
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Number of Units" } },
        },
      },
    });

    return () => chart.destroy();
  }, [dashboard,activeTab,chartReload]);

  if (!dashboard) return <div className="loading">Loading Dashboard...</div>;


  return (
    <div>
      <div className="dashboard2-container">

        <div className="top-heading">
          <img src={car_logo} alt="car_logo" />
          <h1>ZedCars Dashboard</h1>
        </div>

        <div className="below-heading">
          <div className="dashboard-navigation">
            <button onClick={()=> {setActiveTab("dashboard2");setchartReload(prev=> prev+1);}}>Overview</button>
            <button onClick={()=> setActiveTab("inventory")}>Manage Vehicle</button>
            <button onClick={()=> setActiveTab("accessories")}>Manage Accessories</button>
            <button onClick={()=> setActiveTab("users")}>Manage Users</button>
            <button onClick={()=> setActiveTab("report")}>View Report</button>
          </div>

          <div className="dashboard2-overview">

            { activeTab === "dashboard2" && (
              <>
                <div className="overview-heading">
                  <h1>Dashboard Overview</h1>
                </div>

                <div className="analysis-count">
                  <div className="analysis-div">
                    <div className="ana-div">
                      <div className="ana-text">
                        <h4>Total Vehicles</h4>
                      </div>
                      <div className="ana-count">
                        <h4>{dashboard.totalCars || 0}</h4>
                      </div>
                      <div className="ana-logo">
                        <h5><i class="bi bi-car-front"></i></h5>
                      </div>
                      <div className="ana-underline"></div>
                    </div>

                    <div className="ana-div" style={{backgroundColor:'#FFF0E7'}}>
                      <div className="ana-text">
                        <h4>Available Vehicles</h4>
                      </div>
                      <div className="ana-count">
                        <h4>{dashboard.activeVehicles}</h4>
                      </div>
                      <div className="ana-logo">
                        <h5><i class="bi bi-car-front"></i></h5>
                      </div>
                      <div className="ana-underline"></div>
                    </div>

                    <div className="ana-div" style={{backgroundColor:'#FFE8D8', color:'black'}}>
                      <div className="ana-text">
                        <h4>Inventory Price</h4>
                      </div>
                      <div className="ana-count">
                        <h4><i class="bi bi-currency-dollar"></i>{dashboard.vehiclePrice || 0}</h4>
                      </div>
                      <div className="ana-logo">
                        <h5><i class="bi bi-cash"></i></h5>
                      </div>
                      <div className="ana-underline"></div>
                    </div>

                    <div className="ana-div">
                      <div className="ana-text">
                        <h4>Car Sales</h4>
                      </div>
                      <div className="ana-count">
                        <h4>{(dashboard.totalSales || 0).toFixed(2)}</h4>
                      </div>
                      <div className="ana-logo">
                        <h5><i class="bi bi-currency-dollar"></i></h5>
                      </div>
                      <div className="ana-underline"></div>
                    </div>
                  
                  </div>
                </div>

                <div className='acc-analysis-count'>
                  <div className="acc-analysis-count">
                    <div className="acc-ana-count">
                      <div className="acc-count">
                        <h4>8</h4>
                      </div>
                      <div className="acc-name">
                        <h4 className='text-muted'>Vehicle Brands</h4>
                      </div>
                    </div>

                    <div className="acc-ana-count">
                      <div className="acc-count">
                        <h4>{dashboard.totalUsers || 0}</h4>
                      </div>
                      <div className="acc-name">
                        <h4 className='text-muted'>Total Users</h4>
                      </div>
                    </div>

                    <div className="acc-ana-count">
                      <div className="acc-count">
                        <h4><i class="bi bi-currency-dollar"></i>{dashboard.accessoriesTotal || 0}</h4>
                      </div>
                      <div className="acc-name">
                        <h4 className='text-muted'>Acc-Inventory</h4>
                      </div>
                    </div>

                    <div className="acc-ana-count">
                      <div className="acc-count">
                        <h4><i class="bi bi-currency-dollar"></i>{dashboard.accessoriesSales || 0}</h4>
                      </div>
                      <div className="acc-name">
                        <h4 className='text-muted'>Acc-Sales</h4>
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
          <div className="admin-section-responsive">
            <div className="section-header">
              <h2>Recent Inventory</h2>
              <a href="/Admin/Inventory" className="view-all">View All</a>
            </div>
            <div className="inventory-table">
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

          <div className="admin-section-responsive">
            <div className="section-header">
              <h2>Recent Test Drives</h2>
            </div>
            <div className="testdrive-table">
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

              </>
            )}

            {activeTab === "inventory" && (
              <AdminInventory />
            )}

            {activeTab === "accessories" && (
              <ManageAccessories />
            )}

            {activeTab === "users" && (
              <ManageUsers />
            )}

            {activeTab === "report" && (
              <Reports />
            )}


          </div>
        </div>


      </div>
    </div>
  )
}

export default Dashboard2;
