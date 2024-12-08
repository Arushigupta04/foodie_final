import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { toast } from "react-toastify";

// Register chart components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const serverURL = "http://localhost:5000";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState(0);
  const [error, setError] = useState(null);
  const [categoryStats, setCategoryStats] = useState({
    labels: ['Combo', 'All-in-1', 'Main Course', 'Sandwiches', 'Drinks', 'Desserts', 'Ice Creams', 'Biryani'],
    data: [30, 20, 50, 10, 70, 40, 30, 40]
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${serverURL}/api/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const userData = await response.json();
        setUsers(userData);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${serverURL}/api/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const orderData = await response.json();
        setOrders(orderData);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchCategoryStats = async () => {
      try {
        const response = await fetch(`${serverURL}/api/add-new/category-stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch category statistics');
        }
        const stats = await response.json();
        setCategoryStats(stats);
      } catch (error) {
        console.error('Error fetching category stats:', error);
      }
    };

    fetchUsers();
    fetchOrders();
    fetchCategoryStats();
  }, []);

  const handleDelete = async (email, role) => {
    if (role === "Admin") {
      toast.error("Admin cannot be deleted!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const response = await fetch(`${serverURL}/api/user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "User deleted successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(data.error || "Failed to delete user", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting the user", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const totalEarnings = orders.reduce((total, order) => {
    return total + (parseFloat(order.price) * parseInt(order.quantity));
  }, 0);

  const pendingOrders = orders.filter(order => order.status === 'Pending').length;

  const totalProducts = orders.reduce((uniqueProducts, order) => {
    if (!uniqueProducts.includes(order.productId)) {
      uniqueProducts.push(order.productId);
    }
    return uniqueProducts;
  }, []).length;

  const itemsData = {
    labels: categoryStats.labels,
    datasets: [{
      label: 'Category on Platform',
      data: categoryStats.data,
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#AFEEEE', '#FF6384', '#C9CBCF', '#32CD32'],
      borderColor: '#fff',
      borderWidth: 2,
    }],
  };

  const monthlySalesData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [{
      label: 'Monthly Sales',
      data: [5000, 7000, 6000, 8000, 9000],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      fill: true,
      tension: 0.1,
    }],
  };

  const userRoleCounts = users.reduce((counts, user) => {
    counts[user.role] = (counts[user.role] || 0) + 1;
    return counts;
  }, {});

  const userRoleData = {
    labels: Object.keys(userRoleCounts),
    datasets: [{
      label: 'User Roles',
      data: Object.values(userRoleCounts),
      backgroundColor: ['#F3C65C', '#F7B733', '#FF6B6B', '#6B8E23'],
      borderColor: '#fff',
      borderWidth: 1,
    }],
  };

  const totalReviews = 150; // Placeholder for total reviews, replace with actual data if available

  return (
    <div className='gradient-background'>
      <>
        {error ? (
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div id="wrapper" style={{ display: 'flex' }}>
              {/* Side Navigation Bar */}
              <div style={{
                width: '250px',
                backgroundColor: '#343a40',
                color: 'white',
                height: '100vh',
                padding: '20px',
                boxShadow: '2px 0 5px rgba(0,0,0,0.5)'
              }}>
                <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Panel</h4>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li style={{ margin: '10px 0' }}>
                    <a href="/admin/add-items" style={navLinkStyle}>Add New Items</a>
                  </li>
                  <li style={{ margin: '10px 0' }}>
                    <a href="/admin/categories" style={navLinkStyle}>All Categories Info</a>
                  </li>
                  <li style={{ margin: '10px 0' }}>
                    <a href="/admin/categories1" style={navLinkStyle}>All Items Info</a>
                  </li>
                  <li style={{ margin: '10px 0' }}>
                    <a href="/admin/alrect" style={navLinkStyle}>All Recent Orders</a>
                  </li>
                  <li style={{ margin: '10px 0' }}>
                    <a href="/admin/alpay" style={navLinkStyle}>All Payments</a>
                  </li>
                  <li style={{ margin: '10px 0' }}>
                    <a href="/admin/Review" style={navLinkStyle}>All Reviews</a>
                  </li>
                </ul>
              </div>

              {/* Main Content Area */}
              <div style={{ flexGrow: 1, padding: '20px' }}>
                <h1 className="h3 mb-0 text-gray-800" style={{ textAlign: "center" }}>Dashboard</h1>

                {/* First Row of Cards */}
                <div className="row" style={{ justifyContent: "center" }}>
                  <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card shadow h-100 py-2" style={{ backgroundColor: '#007bff' }}>
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-white text-uppercase mb-1">
                              Earnings (Total)
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-white">₹{totalEarnings}</div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-calendar fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card shadow h-100 py-2" style={{ backgroundColor: '#ffc107' }}>
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-white text-uppercase mb-1">
                              Total Orders
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-white">{orders.length}</div>
                          </div>
                          <div className="col-auto">
                            <i className="fa-solid fa-cart-shopping fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card shadow h-100 py-2" style={{ backgroundColor: '#28a745' }}>
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-white text-uppercase mb-1">
                              Total Users
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-white">{users.length}</div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-user-plus fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Row of Cards */}
                <div className="row" style={{ justifyContent: "center" }}>
                  <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card shadow h-100 py-2" style={{ backgroundColor: '#dc3545' }}>
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-white text-uppercase mb-1">
                              Pending Orders
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-white">{pendingOrders}</div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-clock fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card shadow h-100 py-2" style={{ backgroundColor: '#17a2b8' }}>
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-white text-uppercase mb-1">
                              Total Reviews
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-white">{totalReviews}</div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-star fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card shadow h-100 py-2" style={{ backgroundColor: '#6f42c1' }}>
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-white text-uppercase mb-1">
                              Total Products
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-white">{totalProducts}</div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-box fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Graphs */}
                <div className="row" style={{ justifyContent: "center" }}>
                  {/* Items on Platform */}
                  <div className="col-xl-4 col-md-6 mb-4">
                    <div className="card shadow h-100 py-2">
                      <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Items on Platform</h6>
                      </div>
                      <div className="card-body">
                        <div className="chart-container" style={{ width: '100%', height: '300px' }}>
                          <Pie data={itemsData} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Sales */}
                  <div className="col-xl-4 col-md-6 mb-4">
                    <div className="card shadow h-100 py-2">
                      <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Monthly Sales</h6>
                      </div>
                      <div className="card-body">
                        <div className="chart-container" style={{ width: '100%', height: '300px' }}>
                          <Line data={monthlySalesData} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Roles */}
                  <div className="col-xl-4 col-md-6 mb-4">
                    <div className="card shadow h-100 py-2">
                      <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">User Roles</h6>
                      </div>
                      <div className="card-body">
                        <div className="chart-container" style={{ width: '100%', height: '300px' }}>
                          <Bar data={userRoleData} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Users Overview */}
                <div className="row" style={{ justifyContent: "center" }}>
                  <div className="col-xl-10 col-lg-12 mb-4">
                    <div className="card shadow h-100 py-2" style={{ border: "1px solid gray" }}>
                      <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Users Overview</h6>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-bordered" style={{ border: "1px solid gray", width: "100%" }} cellSpacing="0">
                            <thead style={{ backgroundColor: "#f8f9fc", fontWeight: "bold" }}>
                              <tr>
                                <th style={{
                                  border: "1px solid gray",
                                  backgroundColor: "#007bff",
                                  color: "white",
                                  textAlign: "center",
                                  padding: "10px",
                                }}>
                                  Full Name
                                </th>
                                <th style={{
                                  border: "1px solid gray",
                                  backgroundColor: "#007bff",
                                  color: "white",
                                  textAlign: "center",
                                  padding: "10px",
                                }}>
                                  Email
                                </th>
                                <th style={{
                                  border: "1px solid gray",
                                  backgroundColor: "#007bff",
                                  color: "white",
                                  textAlign: "center",
                                  padding: "10px",
                                }}>
                                  Role
                                </th>
                                <th style={{
                                  border: "1px solid gray",
                                  backgroundColor: "#007bff",
                                  color: "white",
                                  textAlign: "center",
                                  padding: "10px",
                                }}>
                                  Delete User
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.map((user) => (
                                <tr key={user._id}>
                                  <td>{user.fullName}</td>
                                  <td>{user.email}</td>
                                  <td>{user.role}</td>
                                  <td style={{ textAlign: "center" }}>
                                    <button
                                      onClick={() => handleDelete(user.email, user.role)}
                                      style={{
                                        border: "1px solid gray",
                                        backgroundColor: "#007bff",
                                        color: "white",
                                        padding: "5px 10px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                      }}
                                      onMouseOver={(e) => {
                                        e.target.style.backgroundColor = "red";
                                        e.target.style.color = "white";
                                      }}
                                      onMouseOut={(e) => {
                                        e.target.style.backgroundColor = "#007bff";
                                        e.target.style.color = "white";
                                      }}
                                    >
                                      Delete User
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </div>
  );
}

// Styling for the sidebar navigation links
const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '10px 15px',
  borderRadius: '5px',
  display: 'block',
  transition: 'background-color 0.3s, color 0.3s',
};

export default AdminDashboard; 
