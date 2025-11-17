import React, { useState } from 'react';
import '../CSS/Dashboard2.css';
import car_logo from '../../../assets/images/zedcar_logo.png';
import AdminInventory from './AdminInventory';
import ManageAccessories from './ManageAccessories';
import ManageUsers from './Users/ManageUsers';
import Reports from './Reports';


const Dashboard2 = () => {

  const [activeTab, setActiveTab] = useState("dashboard2")

  return (
    <div>
      <div className="dashboard2-container">

        <div className="top-heading">
          <img src={car_logo} alt="car_logo" />
          <h1>ZedCars Dashboard</h1>
        </div>

        <div className="below-heading">
          <div className="dashboard-navigation">
            <button onClick={()=> setActiveTab("dashboard2")} >Dashboard</button>
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
                        <h4>30</h4>
                      </div>
                      <div className="ana-logo">
                        <h5>logo</h5>
                      </div>
                      <div className="ana-underline"></div>
                    </div>

                    <div className="ana-div" style={{backgroundColor:'#A1B39E'}}>
                      <div className="ana-text">
                        <h4>Total Vehicles</h4>
                      </div>
                      <div className="ana-count">
                        <h4>30</h4>
                      </div>
                      <div className="ana-logo">
                        <h5>logo</h5>
                      </div>
                      <div className="ana-underline"></div>
                    </div>

                    <div className="ana-div" style={{backgroundColor:'#ebdbc1ff', color:'black'}}>
                      <div className="ana-text">
                        <h4>Total Vehicles</h4>
                      </div>
                      <div className="ana-count">
                        <h4>30</h4>
                      </div>
                      <div className="ana-logo">
                        <h5>logo</h5>
                      </div>
                      <div className="ana-underline"></div>
                    </div>

                    <div className="ana-div">
                      <div className="ana-text">
                        <h4>Total Vehicles</h4>
                      </div>
                      <div className="ana-count">
                        <h4>30</h4>
                      </div>
                      <div className="ana-logo">
                        <h5>logo</h5>
                      </div>
                      <div className="ana-underline"></div>
                    </div>
                  
                  </div>
                </div>

                <div className='acc-analysis-count'>
                  <div className="acc-analysis-count">
                    <div className="acc-ana-count">
                      <div className="acc-count">
                        <h4>20</h4>
                      </div>
                      <div className="acc-name">
                        <h4>Vehicle Brands</h4>
                      </div>
                    </div>

                    <div className="acc-ana-count">
                      <div className="acc-count">
                        <h4>20</h4>
                      </div>
                      <div className="acc-name">
                        <h4>Vehicle Brands</h4>
                      </div>
                    </div>

                    <div className="acc-ana-count">
                      <div className="acc-count">
                        <h4>20</h4>
                      </div>
                      <div className="acc-name">
                        <h4>Vehicle Brands</h4>
                      </div>
                    </div>

                    <div className="acc-ana-count">
                      <div className="acc-count">
                        <h4>20</h4>
                      </div>
                      <div className="acc-name">
                        <h4>Vehicle Brands</h4>
                      </div>
                    </div>
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
