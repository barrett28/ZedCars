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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await apiClient.get('/Reports/sales');
      setReportData(response.data);
      setReportType(selectedReportType);
      setCurrentPage(1);
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

  const currentData = reportType === 'carSales' ? reportData.purchases : reportData.accessoryPurchaseOnly;
  const totalItems = currentData?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = currentData?.slice(startIndex, endIndex) || [];

  const handlePageChange = (e, page) => {
    e.preventDefault();
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const carChartData = {
    pie: {
      labels: reportData.salesByBrand?.map(item => item.brand) || [],
      datasets: [{
        data: reportData.salesByBrand?.map(item => item.totalSales) || [],
        backgroundColor:[
          '#e73939', 
          '#ffc900', 
          '#5682b1', 
          '#E06B80', 
          '#f25912', 
          '#7adaa5' 
          ],
          borderColor: '#444',     // Black border
          borderWidth : 1  
      }]
    },
    bar: {
      labels: reportData.salesByMonths?.map(item => `${new Date(item.year, item.month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`) || [],
      datasets: [{
        label: 'Sales ($)',
        data: reportData.salesByMonths?.map(item => item.totalSales) || [],
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: '#666',
        borderWidth: 2,
        borderRadius: 8
      }]
    }
  };

  const accessoryChartData = {
    pie: {
      labels: reportData.accessorySalesByCategories?.map(item => item.category) || [],
      datasets: [{
        data: reportData.accessorySalesByCategories?.map(item => item.totalSales) || [],
                backgroundColor:[
                  '#5682b1', 
                  '#e73939', 
                  '#E06B80', 
                  '#f25912', 
                  '#ffc900', 
          '#7adaa5' 
          ],
          borderColor: '#444',     // Black border
          borderWidth : 1  
      }]
    },
    bar: {
      labels: reportData.accessoryMonthlySales?.map(item => `${new Date(item.year, item.month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`) || [],
      datasets: [{
        label: 'Sales ($)',
        data: reportData.accessoryMonthlySales?.map(item => item.totalSales) || [],
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: '#666',
        borderWidth: 2,
        borderRadius: 8
      }]
    }
  };

  return (
    <div className="reports-page">
      <div className="container">
        {/* Header */}
        <div className="reports-header">
          <h1>📊 Sales Reports</h1>
          <p>Comprehensive analytics and insights for your business</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <label>Report Type</label>
              <select 
                value={selectedReportType} 
                onChange={(e) => setSelectedReportType(e.target.value)} 
                className="form-select"
              >
                <option value="carSales"><i class="fa-thin fa-car-side"></i>Car Sales</option>
                <option value="accessorySales">🔧 Accessory Sales</option>
              </select>
            </div>
            <div className="action-buttons">
              <button className="btn btn-primary" onClick={fetchReportData}>
                <i className="bi bi-eye"></i> View Report
              </button>
              <button className="btn btn-secondary" onClick={downloadPDF}>
                <i className="bi bi-file-pdf"></i> PDF
              </button>
              <button className="btn btn-success" onClick={downloadExcel}>
                <i className="bi bi-file-excel"></i> Excel
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {reportType === 'carSales' ? (
          <div className="summary-section">
            <div className="summary-card">
              <h6>Total Sales</h6>
              <h4>${reportData.totalSalesValue?.toFixed(2)}</h4>
              <small>Total revenue from car sales</small>
            </div>
            <div className="summary-card">
              <h6>Units Sold</h6>
              <h4>{reportData.totalUnitsSold}</h4>
              <small>Number of cars sold</small>
            </div>
            <div className="summary-card">
              <h6>Average Sale</h6>
              <h4>${reportData.averageSalesValue?.toFixed(2)}</h4>
              <small>Average price per vehicle</small>
            </div>
          </div>
        ) : (
          <div className="summary-section">
            <div className="summary-card">
              <h6>Total Sales</h6>
              <h4>${reportData.accessoryTotalSales?.toFixed(2)}</h4>
              <small>Total revenue from accessories</small>
            </div>
            <div className="summary-card">
              <h6>Units Sold</h6>
              <h4>{reportData.accessoryCount}</h4>
              <small>Number of accessories sold</small>
            </div>
            <div className="summary-card">
              <h6>Average Sale</h6>
              <h4>${reportData.accessoryAverageSales?.toFixed(2)}</h4>
              <small>Average price per accessory</small>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="charts-section">
          <div className="chart-card">
            <h5>{reportType === 'carSales' ? 'Sales by Brand' : 'Sales by Category'}</h5>
            <Doughnut 
              data={reportType === 'carSales' ? carChartData.pie : accessoryChartData.pie}
              options={{ 
                maintainAspectRatio: false, 
                responsive: true,
                plugins: {
                  legend: { position: 'bottom' }
                }
              }}
            />
          </div>
          <div className="chart-card">
            <h5>{reportType === 'carSales' ? '📈 Monthly Sales Trend' : '📈 Monthly Sales Trend'}</h5>
            <Bar 
              data={reportType === 'carSales' ? carChartData.bar : accessoryChartData.bar}
              options={{ 
                maintainAspectRatio: false, 
                responsive: true,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </div>

        {/* Purchase History Table */}
        <div className="table-section">
          <h5>{reportType === 'carSales' ? 'Car Purchase History' : 'Accessory Purchase History'}</h5>
          <div className="reports-table-responsive">
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
                      <th>Email</th>
                    </>
                  ) : (
                    <>
                      <th>Buyer Name</th>
                      <th>Email</th>
                      <th>Sale Price</th>
                      <th>Accessories</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {reportType === 'carSales' 
                  ? paginatedData?.map((purchase, index) => (
                      <tr key={index}>
                        <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                        <td>{purchase.car?.brand}</td>
                        <td>{purchase.car?.model}</td>
                        <td>${purchase.purchasePrice?.toFixed(2)}</td>
                        <td>{purchase.buyerName}</td>
                        <td>{purchase.buyerEmail}</td>
                      </tr>
                    ))
                  : paginatedData?.map((accessory, index) => (
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

        {/* Pagination */}
        {totalPages > 0 && (
          <>
            <nav className="admin-pagination-nav">
              <ul className="admin-pagination">
                <li className={`admin-page-item ${currentPage <= 1 ? "disabled" : ""}`}>
                  <button
                    onClick={(e) => handlePageChange(e, currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    &laquo;
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`admin-page-item ${i + 1 === currentPage ? "active" : ""}`}
                  >
                    <button onClick={(e) => handlePageChange(e, i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li className={`admin-page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
                  <button
                    onClick={(e) => handlePageChange(e, currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>

            <div className="admin-pagination-info">
              Showing {startIndex + 1}–{Math.min(endIndex, totalItems)} of {totalItems} {reportType === 'carSales' ? 'purchases' : 'accessory purchases'}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
