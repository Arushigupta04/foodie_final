
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
  const [graphData, setGraphData] = useState(null);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalitems, setTotalitems] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [error, setError] = useState(null);

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

    fetchUsers();
    fetchOrders();
  }, []);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${serverURL}/api/review`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const reviewData = await response.json();
        setTotalReviews(reviewData.length); // Update total review count
      } catch (error) {
        setError(error.message); // Handle errors
      }
    };

    fetchReviews();
  }, []); 
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${serverURL}/api/add-new/categoriess/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
  
       
        const categoryData = await response.json();
        setTotalCategories(categoryData.length);
        setCategories(categoryData); // Store category data
      } catch (error) {
        setError(error.message);
      }
    };
  
    fetchCategories();
  }, []);
  
  const itemsData = {
    labels: categories.map(category => category.category_title),
    datasets: [
      {
        label: 'Category on Platform',
        data: categories.map(category => category.item_count),
       backgroundColor: [
  '#D32F2F', // Dark Red
  '#1976D2', // Dark Blue
  '#FBC02D', // Dark Yellow
  '#388E3C', // Dark Green
  '#0288D1', // Dark Cyan
  '#8E24AA', // Dark Purple
  '#FFCE56', // Dark Blue again (adjust if needed)
  '#C9CBCF', // Dark Magenta
]
,
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };
  
useEffect(() => {
const fetchItems = async () => {
    try {
      const response = await fetch(`${serverURL}/api/add-new/items`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }

      const itemData = await response.json();
      setTotalitems(itemData.length); 
    } catch (error) {
      setError(error.message); 
    }
  };

  fetchItems();
}, []);
  const handleDelete = async (email, role) => {
    // Prevent deleting Admin users
    if (role === "Admin") {
      toast.error("Admin cannot be deleted!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          borderRadius: "8px", // Rounded corners
          backgroundColor: "#fff", // White background
          color: "#000", // Black text for readability
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
        },
      });
      return; // Exit the function early
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
          progress: undefined,
          style: {
            borderRadius: "8px",
            backgroundColor: "#fff", // White background
            color: "#000", // Black text for readability
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
          },
        });
      } else {
        toast.error(data.error || "Failed to delete user", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            borderRadius: "8px",
            backgroundColor: "#fff", // White background
            color: "#000", // Black text for readability
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
          },
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
        progress: undefined,
        style: {
          borderRadius: "8px",
          backgroundColor: "#fff", // White background
          color: "#000", // Black text for readability
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
        },
      });
    }
  };

  const totalEarnings = orders.reduce((total, order) => {
    return total + (parseFloat(order.price) * parseInt(order.quantity));
  }, 0);

  const pendingOrders = orders.filter(order => order.status === 'Pending').length;

  const orderStatusCounts = orders.reduce((counts, order) => {
    counts[order.status] = (counts[order.status] || 0) + 1;
    return counts;
  }, {});

  const userRoleCounts = users.reduce((counts, user) => {
    counts[user.role] = (counts[user.role] || 0) + 1;
    return counts;
  }, {});

 

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`${serverURL}/api/v1/pay/payments/last7days`);
        const { success, labels, data } = await response.json();

        if (success) {
          // Reverse the labels and data arrays
          const reversedLabels = labels.reverse();
          const reversedData = data.reverse();

          setGraphData({
            labels: reversedLabels.map((label) =>
              new Date(label).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            ),
            datasets: [
              {
                label: "Last 7 Days Payments",
                data: reversedData,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
                fill: true,
                tension: 0.1,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);


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

  // Static data for the last two cards
  // const totalReviews = 150; // Example static data
  // Example static data

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
            <div id="wrapper">
              <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                  <div className="container-fluid" style={{ display: "contents" }}>
                    <div className="d-sm-flex align-items-center justify-content-center mb-4">
                    <h1 
  className="text-6xl font-extrabold mb-10 mt-4" 
  style={{ textAlign: "center", color: "#1d4ed8" }}
>
  Dashboard
</h1>


                    </div>

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
                                  Total Categories
                                </div>
                                <div className="h5 mb-0 font-weight-bold text-white">{totalCategories}</div>
                              </div>
                              <div className="col-auto">
                                <i className="fas fa-box fa-2x text-gray-300"></i>
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
                                  Total Items
                                </div>
                                <div className="h5 mb-0 font-weight-bold text-white">{totalitems}</div> {/* Static data */}
                              </div>
                              <div className="col-auto">
                                <i className="fas fa-shopping-basket fa-2x text-gray-300"></i>
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
                                  Total Reviews
                                </div>
                                <div className="h5 mb-0 font-weight-bold text-white">{totalReviews}</div> {/* Static data */}
                              </div>
                              <div className="col-auto">
                                <i className="fas fa-star fa-2x text-gray-300"></i>
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
          <h6 className="m-0 font-weight-bold text-primary">Weekly Sales</h6>
        </div>
        <div className="card-body">
          {graphData ? (
            <div className="chart-container" style={{ width: "100%", height: "300px" }}>
              <Line data={graphData} />
            </div>
          ) : (
            <p>Loading chart...</p>
          )}
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
                                      backgroundColor: "#007bff", // Blue background
                                      color: "white", // White text
                                      textAlign: "center", // Center-align text
                                      padding: "10px", // Add some padding for spacing
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

                    <div className="row" style={{ justifyContent: "center", marginTop: "20px" }}>
                      <div className="col-auto">
                        <a
                          href="http://localhost:3000/admin/add-items"
                          className="btn btn-primary"
                          style={{
                            fontSize: "20px",
                            padding: "15px 20px",
                            width: "200px",
                            height: "60px",
                            backgroundColor: "#007bff",
                            color: "white",
                            textAlign: "center",
                            lineHeight: "30px", // Center text vertically
                            display: "block", // Make button a block-level element
                            borderRadius: "8px", // Rounded corners
                            textDecoration: "none",
                            transition: "background-color 0.3s ease, transform 0.2s ease", // Hover transitions
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#0056b3"; // Darker blue on hover
                            e.target.style.transform = "scale(1.05)"; // Slight zoom effect
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = "#007bff"; // Reset color
                            e.target.style.transform = "scale(1)"; // Reset scale
                          }}
                        >
                          Add New Items
                        </a>
                      </div>

                      <div className="col-auto">
                        <a
                          href="http://localhost:3000/admin/categories"
                          className="btn btn-secondary"
                          style={{
                            fontSize: "20px",
                            padding: "15px 10px",
                            width: "200px",
                            height: "60px",
                            backgroundColor: "#007bff",
                            color: "white",
                            textAlign: "center",
                            lineHeight: "30px", // Center text vertically
                            display: "block", // Make button a block-level element
                            borderRadius: "8px", // Rounded corners
                            textDecoration: "none",
                            transition: "background-color 0.3s ease, transform 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#0056b3";
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = "#007bff";
                            e.target.style.transform = "scale(1)";
                          }}
                        >
                          All Categories Info
                        </a>
                      </div>

                      <div className="col-auto">
                        <a
                          href="http://localhost:3000/admin/categories1"
                          className="btn btn-primary"
                          style={{
                            fontSize: "20px",
                            padding: "15px 30px",
                            width: "200px",
                            height: "60px",
                            backgroundColor: "#007bff",
                            color: "white",
                            textAlign: "center",
                            lineHeight: "30px",
                            display: "block",
                            borderRadius: "8px",
                            textDecoration: "none",
                            transition: "background-color 0.3s ease, transform 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#0056b3";
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = "#007bff";
                            e.target.style.transform = "scale(1)";
                          }}
                        >
                          All Items Info
                        </a>
                      </div>

                      <div className="col-auto">
                        <a
                          href="http://localhost:3000/admin/alrect"
                          className="btn btn-primary"
                          style={{
                            fontSize: "20px",
                            padding: "13px 15px",
                            width: "200px",
                            height: "60px",
                            backgroundColor: "#007bff",
                            color: "white",
                            textAlign: "center",
                            lineHeight: "30px",
                            display: "block",
                            borderRadius: "8px",
                            textDecoration: "none",
                            transition: "background-color 0.3s ease, transform 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#0056b3";
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = "#007bff";
                            e.target.style.transform = "scale(1)";
                          }}
                        >
                          All Recent Orders
                        </a>
                      </div>

                      <div className="col-auto">
                        <a
                          href="http://localhost:3000/admin/alpay"
                          className="btn btn-primary"
                          style={{
                            fontSize: "20px",
                            padding: "15px 30px",
                            width: "200px",
                            height: "60px",
                            backgroundColor: "#007bff",
                            color: "white",
                            textAlign: "center",
                            lineHeight: "30px",
                            display: "block",
                            borderRadius: "8px",
                            textDecoration: "none",
                            transition: "background-color 0.3s ease, transform 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#0056b3";
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = "#007bff";
                            e.target.style.transform = "scale(1)";
                          }}
                        >
                          All Payments
                        </a>
                      </div>

                      <div className="col-auto">
                        <a
                          href="http://localhost:3000/admin/Review"
                          className="btn btn-primary"
                          style={{
                            fontSize: "20px",
                            padding: "15px 30px",
                            width: "200px",
                            height: "60px",
                            backgroundColor: "#007bff",
                            color: "white",
                            textAlign: "center",
                            lineHeight: "30px",
                            display: "block",
                            borderRadius: "8px",
                            textDecoration: "none",
                            transition: "background-color 0.3s ease, transform 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#0056b3";
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = "#007bff";
                            e.target.style.transform = "scale(1)";
                          }}
                        >
                          All Reviews
                        </a>
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

export default AdminDashboard;
