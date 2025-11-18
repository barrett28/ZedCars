import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import apiClient from '../../../api/apiClient';
import '../CSS/Reports.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('carSales');
  const [selectedReportType, setSelectedReportType] = useState('carSales');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await apiClient.get('/Reports/sales');
      setReportData(response.data);
      setReportType(selectedReportType);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await apiClient.get('/Reports/sales/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ZedCars_Sales_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const downloadExcel = async () => {
    try {
      const response = await apiClient.post('/Reports/sales/excel', {}, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ZedCars_Sales_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  if (loading) return <div className="loading">Loading reports...</div>;
  if (!reportData) return <div className="error">Failed to load report data</div>;

  const carChartData = {
    pie: {
      labels: reportData.salesByBrand?.map(item => item.brand) || [],
      datasets: [{
        data: reportData.salesByBrand?.map(item => item.totalSales) || [],
        backgroundColor: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c']
      }]
    },
    bar: {
      labels: reportData.salesByMonths?.map(item => `${new Date(item.year, item.month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`) || [],
      datasets: [{
        label: 'Sales',
        data: reportData.salesByMonths?.map(item => item.totalSales) || [],
        backgroundColor: '#3498db'
      }]
    }
  };

  const accessoryChartData = {
    pie: {
      labels: reportData.accessorySalesByCategories?.map(item => item.category) || [],
      datasets: [{
        data: reportData.accessorySalesByCategories?.map(item => item.totalSales) || [],
        backgroundColor: ['#1abc9c', '#9b59b6', '#f39c12', '#e74c3c', '#2ecc71', '#3498db']
      }]
    },
    bar: {
      labels: reportData.accessoryMonthlySales?.map(item => `${new Date(item.year, item.month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`) || [],
      datasets: [{
        label: 'Sales',
        data: reportData.accessoryMonthlySales?.map(item => item.totalSales) || [],
        backgroundColor: '#1abc9c'
      }]
    }
  };

  return (
    <div className="reports-page">
      <div className="admin-header">
        <h1>Reports</h1>
        <p>View and generate business reports</p>
        <a href="/admin/dashboard" className="btn btn-secondary">Back to Dashboard</a>
      </div>

      <div className="container">
        <div className="filters-section">
          <div className="row">
            <div className="col-md-3">
              <label>Report Type</label>
              <select value={selectedReportType} onChange={(e) => setSelectedReportType(e.target.value)} className="form-select">
                <option value="carSales">Car Sales</option>
                <option value="accessorySales">Accessory Sales</option>
              </select>
            </div>
            <div className="col-md-9 d-flex gap-2">
              <button className="btn btn-primary" onClick={fetchReportData}>View Report</button>
              <button className="btn btn-secondary" onClick={downloadPDF}>PDF</button>
              <button className="btn btn-success" onClick={downloadExcel}>Excel</button>
            </div>
          </div>
        </div>

        {reportType === 'carSales' ? (
          <div className="summary-section">
            <div className="summary-card">
              <h6>Total Sales</h6>
              <h4>${reportData.totalSalesValue?.toFixed(2)}</h4>
              <small>Total sales of Cars</small>
            </div>
            <div className="summary-card">
              <h6>Units Sold</h6>
              <h4>{reportData.totalUnitsSold}</h4>
              <small>Number of cars sold</small>
            </div>
            <div className="summary-card">
              <h6>Average Sales</h6>
              <h4>${reportData.averageSalesValue?.toFixed(2)}</h4>
              <small>Average sale price of cars</small>
            </div>
          </div>
        ) : (
          <div className="summary-section">
            <div className="summary-card">
              <h6>Total Accessory Sales</h6>
              <h4>${reportData.accessoryTotalSales?.toFixed(2)}</h4>
              <small>Total sales of Accessories</small>
            </div>
            <div className="summary-card">
              <h6>Units Sold</h6>
              <h4>{reportData.accessoryCount}</h4>
              <small>Number of accessories sold</small>
            </div>
            <div className="summary-card">
              <h6>Average Sales</h6>
              <h4>${reportData.accessoryAverageSales?.toFixed(2)}</h4>
              <small>Average sale price of accessories</small>
            </div>
          </div>
        )}

        <div className="charts-section">
          <div className="chart-card">
            <h5>{reportType === 'carSales' ? 'Car Sales by Brand' : 'Accessory Sales by Category'}</h5>
            <Doughnut className='doughnut-chart' data={reportType === 'carSales' ? carChartData.pie : accessoryChartData.pie} />
          </div>
          <div className="chart-card">
            <h5>{reportType === 'carSales' ? 'Car Monthly Sales Trend' : 'Accessory Monthly Sales Trend'}</h5>
            <Bar className='bar-chart' data={reportType === 'carSales' ? carChartData.bar : accessoryChartData.bar} />
          </div>
        </div>

        <div className="table-section">
          <h5>{reportType === 'carSales' ? 'Car Purchase History' : 'Accessory Purchase History'}</h5>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  {reportType === 'carSales' ? (
                    <>
                      <th>Brand</th>
                      <th>Vehicle</th>
                      <th>Sale Price</th>
                      <th>Buyer</th>
                      <th>Buyer Email</th>
                    </>
                  ) : (
                    <>
                      <th>Buyer Name</th>
                      <th>Buyer Email</th>
                      <th>Sale Price</th>
                      <th>Accessories</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {reportType === 'carSales' 
                  ? reportData.purchases?.map((purchase, index) => (
                      <tr key={index}>
                        <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                        <td>{purchase.car?.brand}</td>
                        <td>{purchase.car?.model}</td>
                        <td>${purchase.purchasePrice?.toFixed(2)}</td>
                        <td>{purchase.buyerName}</td>
                        <td>{purchase.buyerEmail}</td>
                      </tr>
                    ))
                  : reportData.accessoryPurchaseOnly?.map((accessory, index) => (
                      <tr key={index}>
                        <td>{new Date(accessory.purchaseDate).toLocaleDateString()}</td>
                        <td>{accessory.buyerName}</td>
                        <td>{accessory.buyerEmail}</td>
                        <td>${accessory.totalPrice?.toFixed(2)}</td>
                        <td>{accessory.selectedAccessoriesString}</td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
