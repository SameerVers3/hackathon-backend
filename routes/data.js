const { Router } = require("express");
const { User } = require("../database")
const authMiddleware = require('../middleware/authMiddleware');
const jwt = require("jsonwebtoken");
const JWT_SECRET = "procom";
const { Payment, Merchant} = require("../database")

const router = Router();


const getUserAccount = async (token) => {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({
        username: decoded.username
    }) 

    return user.accountNumber
}

router.get("/getdata", authMiddleware, async (req, res) => {

    try {
        const users = await User.find({}, 'username email phone accountNumber createdAt');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data" });
    }
});

router.get("/getuserdata", authMiddleware, async (req, res) => {
    const token = req.headers.authorization;

    const userAccountNumber = await getUserAccount(token);

    if (!userAccountNumber) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        const payments = await Payment.find({ accountNumber: userAccountNumber });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data" });
    }
});




module.exports = router;