const express=require("express")
const {checkout, paymentVerification,getAllUsersWithPayments,getLast7DaysPayments}=require("../controllers/paymentController.js")


const router = express.Router();

router.route("/checkout").post(checkout);
router.route('/payments/last7days').get(getLast7DaysPayments);

router.route("/paymentverification").post(paymentVerification);
router.route("/getAllUserPayments").get(getAllUsersWithPayments)
module.exports = router;
