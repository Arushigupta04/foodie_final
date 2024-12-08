
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import './AllPayments.css'; // Make sure to import the CSS file

// const AllPayments = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/v1/pay/getAllUserPayments");
//         const allPayments = response.data.userPayments || [];

//         // Calculate the date 7 days ago
//         const sevenDaysAgo = new Date();
//         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//         // Filter payments from the last 7 days
//         const recentPayments = allPayments.filter((payment) => {
//           const paymentDate = new Date(payment.date);
//           return paymentDate >= sevenDaysAgo;
//         });

//         // Sort payments by date in descending order (most recent first)
//         recentPayments.sort((a, b) => new Date(b.date) - new Date(a.date));

//         setOrders(recentPayments);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error Fetching Payments:", err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-gray-500 text-xl">Loading payments...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-red-500 text-xl">Error: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="gradient-background">
//       <div className="flex justify-center items-center min-h-screen p-8 bg-gray-50">
//         <div className="w-full max-w-6xl p-6 shadow-md rounded-md">
//           <h1 className="text-6xl font-bold  mb-8 text-center text-blue-600">
//             Recent Payments
//           </h1>
//           {orders.length === 0 ? (
//             <p className="text-center text-gray-500">No payments found for the last 7 days.</p>
//           ) : (
//             <table className="min-w-full border-collapse border border-black">
//               <thead>
//                 <tr className="bg-blue-600 text-white">
//                   <th className="border border-black px-4 py-2">S.No</th>
//                   <th className="border border-black px-4 py-2">Amount</th>
//                   <th className="border border-black px-4 py-2">Date</th>
//                   <th className="border border-black px-4 py-2">User ID</th>
//                   <th className="border border-black px-4 py-2">Email</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((order, index) => (
//                   <tr
//                     key={order._id}
//                     className={index % 2 === 0 ? "bg-gray-100" : "bg-white hover:bg-gray-200"}
//                   >
//                     <td className="border border-black px-4 py-2 text-center">{index + 1}</td>
//                     <td className="border border-black px-4 py-2 text-right">
//                       {order.amount ? `${order.amount} Rs` : "N/A"}
//                     </td>
//                     <td className="border border-black px-4 py-2 text-center">
//                       {new Date(order.date).toLocaleDateString()}
//                     </td>
//                     <td className="border border-black px-4 py-2 text-center">
//                       {order.user?._id || "Not Available"}
//                     </td>
//                     <td className="border border-black px-4 py-2 text-left">
//                       {order.user?.email || "Not Available"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllPayments;
import React, { useEffect, useState } from "react";
import axios from "axios";
import './AllPayments.css'; // Ensure this CSS file is created and properly linked

const AllPayments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/pay/getAllUserPayments");
        const allPayments = response.data.userPayments || [];

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentPayments = allPayments.filter((payment) => {
          const paymentDate = new Date(payment.date);
          return paymentDate >= sevenDaysAgo;
        });

        recentPayments.sort((a, b) => new Date(b.date) - new Date(a.date));

        setOrders(recentPayments);
        setLoading(false);
      } catch (err) {
        console.error("Error Fetching Payments:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="containera">
      <div className="content">
        <h1 className="bestttt">Recent Payments</h1>
        {orders.length === 0 ? (
          <p>No payments found for the last 7 days.</p>
        ) : (
          <table className="payment-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Amount</th>
                <th>Date</th>
                <th>User ID</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                  <td>{index + 1}</td>
                  <td>{order.amount ? `${order.amount} Rs` : "N/A"}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>{order.user?._id || "Not Available"}</td>
                  <td>{order.user?.email || "Not Available"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllPayments;
