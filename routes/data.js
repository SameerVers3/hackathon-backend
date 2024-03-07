const { Router } = require("express");
const { User, Admin } = require("../database")
const authMiddleware = require('../middleware/authMiddleware');
const jwt = require("jsonwebtoken");
const router = Router();


router.get("/getdata", authMiddleware, async (req, res) => {
    try {
        const users = await User.find({}, 'username email phone accountNumber createdAt');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data" });
    }
});

module.exports = router;