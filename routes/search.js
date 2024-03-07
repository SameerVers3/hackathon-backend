const { Router } = require("express");
const { User, Note, Label } = require("../database")
const authMiddleware = require('../middleware/authMiddleware');
const jwt = require("jsonwebtoken");
const router = Router();

const getUserId = async (token) => {
    const words = token.split(" ")
    const jwtToken = words[1];

    console.log(jwtToken);
    const decoded = jwt.decode(jwtToken);

    if (decoded.username){
        let user = await User.findOne({
            username: decoded.username
        })

        return user._id;
    }
}

router.get("/", authMiddleware, async (req, res) => {
    try {
        console.log("hello world");
        const id = await getUserId(req.headers.authorization);
        const keyword = req.query.q;

        // Search for notes based on title, content, and label title
        const matchingLabels = await Label.find({
            userId: id,
            title: { $regex: keyword, $options: 'i' } // Case-insensitive label title search
        });
        
        // Extract label IDs from the matching labels
        const matchingLabelIds = matchingLabels.map(label => label._id);
        
        // Step 2: Find notes based on user ID and matching label IDs
        let notes = await Note.find({
            userId: id,
            $or: [
                { title: { $regex: keyword, $options: 'i' } }, // Case-insensitive title search
                { content: { $regex: keyword, $options: 'i' } }, // Case-insensitive content search
                { 'labels': { $in: matchingLabelIds } } // Check if any matching label ID exists in the "labels" array
            ]
        });

        res.json(notes);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;