import React from 'react'
import '../CSS/Dashboard2.css'

const Dashboard2 = () => {
  return (
    <div>
      <div className="dashboard2-container">

        <div className="top-heading">
          <h1>ZedCars Dashboard</h1>
        </div>

        <div className="below-heading">
          <div className="dashboard-navigation">
            <button>Add New Vehicle</button>
            <button>Add New Vehicle</button>
            <button>Manage Vehicle</button>
            <button>Manage Accessories</button>
            <button>Manage Users</button>
            <button>View Report</button>
          </div>

          <div className="dashboard-overview">
            <div className="overview-heading">
              <h1>Dashboard OverView</h1>
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
          </div>

        </div>


      </div>
    </div>
  )
}

export default Dashboard2;
