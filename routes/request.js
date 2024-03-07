const { Router } = require("express");
const { User, Payment} = require("../database")
const authMiddleware = require('../middleware/authMiddleware');
const jwt = require("jsonwebtoken");
const router = Router();


router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { customeraccount, paymentpurpose, bankname, customername, paymentamount } = req.body;
        console.log({
            customeraccount, paymentpurpose, bankname, customername, paymentamount
        })
        // Validate the incoming data (you might want to add more validation)
        if (!customeraccount || !paymentpurpose || !bankname || !customername || !paymentamount) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check if the customer with the provided account number exists
        const existingCustomer = await User.findOne({ username: customername, accountNumber: customeraccount });
        if (!existingCustomer) {
            return res.status(404).json({ message: "Customer with the provided account number not found" });
        }
        console.log("existingCustomer");
        // Create a new payment document
        const newPayment = new Payment({
            accountNumber: customeraccount,
            status: "pending",
            description: paymentpurpose,
            bank: bankname,
            customer: customername,
            amount: paymentamount
        });

        // Save the payment to the database
        await newPayment.save();

        // Respond with the created payment
        res.status(201).json(newPayment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating payment request" });
    }
});


module.exports = router;