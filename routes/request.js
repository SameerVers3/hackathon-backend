const { Router } = require("express");
const { User, Payment, Merchant} = require("../database")
const authMiddleware = require('../middleware/authMiddleware');
const jwt = require("jsonwebtoken");
const router = Router();

const getUserAccount = async (token) => {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({
        username: decoded.username
    }) 

    return user.accountNumber
}

router.get("/data", authMiddleware, async (req, res) => {
    const token = req.headers.authorization;

    const userAccountNumber = await getUserAccount(token);

    if (!userAccountNumber) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        const payment = await Payment.find({}, 'accountNumber status description bank customer amount');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data" });
    }
});



router.post("/create", authMiddleware, async (req, res) => {
    try {
        
        const { customeraccount, paymentpurpose, bankname, customername, paymentamount, merchantaccount, tstatus} = req.body;
        console.log({
            customeraccount, paymentpurpose, bankname, customername, paymentamount, merchantaccount, tstatus
        })
        // Validate the incoming data (you might want to add more validation)
        if (!customeraccount || !paymentpurpose || !bankname || !customername || !paymentamount || !merchantaccount) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const existingCustomer = await User.findOne({ username: customername, accountNumber: customeraccount });
        if (!existingCustomer) {
            return res.status(404).json({ message: "Customer with the provided account number not found" });
        }

        console.log("existingCustomer");
        const merchant = await Merchant.findOne({ accountNumber: merchantaccount });
        console.log(merchant)
        if (!merchant) {
            return res.status(404).json({ message: "Merchant with the provided account number not found" });
        }

        if (!tstatus){
            tstatus = "pending"
        }

        console.log("existingCustomer");
        // Create a new payment document
        const newPayment = new Payment({
            accountNumber: customeraccount,
            status: tstatus,
            description: paymentpurpose,
            bank: bankname,
            customer: customername,
            amount: paymentamount,
            merchant: merchant.accountNumber
        });

        console.log("here")


        // Save the payment to the database
        await newPayment.save();

        // Respond with the created payment
        res.status(201).json({
            message: "success"
        }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating payment request" });
    }
});


router.patch("/update", authMiddleware, async (req, res) => {
    const { accountNumber, customer, amount, date, tstatus } = req.body;

    console.log({
        accountNumber, customer, amount, date, tstatus
    })
    
    try {
        const payment = await Payment.findOne({
            accountNumber: accountNumber,
            customer: customer,
            amount: amount,
            date: date
        });

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        payment.status = tstatus;
        console.log(tstatus);
        await payment.save();

        res.json({ message: "Payment status updated successfully", payment });
    } catch (error) {
        res.status(500).json({ message: "Error updating payment status" });
    }
});


module.exports = router;