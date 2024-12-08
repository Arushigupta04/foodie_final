

// module.exports = { checkout, paymentVerification, getAllUsersWithPayments };
const Payment = require("../models/paymentModel.js");
const crypto = require("crypto");
// const User = require("../models/user.js");
const Razorpay = require("razorpay");
const moment = require("moment"); 

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

// Checkout function: Create an order
const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount ), // Razorpay expects the amount in paise (smallest currency unit)
    currency: "INR",
  };
  
  try {
    console.log("instance is", instance);
    const order = await instance.orders.create(options);
    console.log("------------------");
    console.log(order);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error in creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};

// Payment Verification function
const paymentVerification = async (req, res) => {
  console.log("------------------------start");
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,amount,id} = req.body;
    // console.log("id is"+id)
    // Generate body for signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("Verifying Payment with body:", body);

    // Generate the expected signature using HMAC SHA256 and Razorpay API Secret
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);

    // Compare the signatures
    const isAuthentic = expectedSignature === razorpay_signature;
    console.log(isAuthentic);

    if (isAuthentic) {
      // Save payment details in the database, including userId
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        userId:id, 
        amount:amount/100
        // Storing the user ID for tracking the user who made the payment
      });

      console.log("Payment success");
      return res.status(200).json({
        success: true,
        message: "Payment successful",
      });
    } else {
      // Payment verification failed
      console.log("Payment verification failed");
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Error in payment verification:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const getAllUsersWithPayments = async (req, res) => {
  try {
    // Find all payments and populate user information using 'userId'
    const payments = await Payment.find().populate('userId', 'firstName lastName email');

    if (!payments.length) {
      return res.status(404).json({
        success: false,
        message: "No payments found",
      });
    }

    // Format the response to include user info along with the payment amount
    const userPayments = payments.map(payment => ({
      user: payment.userId,  // Populated user info
      amount: payment.amount,
      date: payment.createdAt,  // Amount from the payment 

    }));

    res.status(200).json({
      success: true,
      userPayments,
    });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getLast7DaysPayments = async (req, res) => {
  try {
    const endDate = moment().endOf("day").utc(); // End of today in UTC
    const startDate = moment().subtract(7, "days").startOf("day").utc(); // Start of 7 days ago in UTC

    // Aggregate payments within the last 7 days
    const payments = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" } },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Create an array of the last 7 days
    const allDates = [];
    for (let i =6; i >=0; i--) {
      allDates.push(moment().subtract(i, "days").utc().format("YYYY-MM-DD"));
    }

    // Map payments to dates, filling missing dates with 0
    const paymentMap = payments.reduce((acc, payment) => {
      acc[payment._id] = payment.totalAmount;
      return acc;
    }, {});

    const labels = allDates;
    const data = allDates.map((date) => paymentMap[date] || 0);

    res.status(200).json({ success: true, labels, data });
  } catch (error) {
    console.error("Error fetching last 7 days payments:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



module.exports = { checkout, paymentVerification, getAllUsersWithPayments, getLast7DaysPayments };
