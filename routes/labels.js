const { Router } = require("express");
const { User, Label, Note } = require("../database")
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

router.post("/", authMiddleware, async (req, res) => {
    const id = await getUserId(req.headers.authorization);

    const title = req.body.title;

    await Label.create({
        userId: id,
        title: title
    })

    res.json({  
        message: "Label Created Successfully"
    })
})

router.get("/", authMiddleware, async (req, res) => {
    const id = await getUserId(req.headers.authorization);


    let labels = await Label.find({
        userId: id
    })

    console.log(labels);

    res.json(labels);
})

router.get("/:id", authMiddleware, async (req, res) => {
    const id = await getUserId(req.headers.authorization);

    const labelId = req.params.id;

    let notes = await Note.find({
        userId: id,
        labels: { $in: labelId }
    })

    console.log("hereeeeeeee");
    console.log(notes);

    if (notes){
        res.json({
            notes
        })
    }else{
        res.status(404).json({
            "message": "Label Not Found"
        })
    }
})


router.post("/", authMiddleware, async (req, res) => {
    const id = await getUserId(req.headers.authorization);

    const title = req.body.title;

    await Label.create({
        userId: id,
        title: title
    })

    res.json({  
        message: "Label Created Successfully"
    })
})

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const userid = await getUserId(req.headers.authorization);
        const id = req.params.id;

        console.log("here")
        let title = req.body.title;

        if (id) {
            console.log("hereeeeee");
            // Find and update the note based on _id and userId
            let updatedLabel = await Label.findOneAndUpdate(
                {
                    _id: id,
                    userId: userid
                },
                {
                    title
                },
                {
                    new: true
                }
            );

            console.log("hereeeeee2");

            if (updatedLabel) {
                console.log("hereeeeee3");
                res.json({
                    message: "Label Updated Successfully",
                    updatedLabel: updatedLabel
                });
            } else {
                res.status(404).json({
                    message: "Label Not Found"
                });
            }
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    const id = await getUserId(req.headers.authorization);

    const labelId = req.params.id;

    let notes = await Label.findOneAndDelete({
        _id: labelId,
        userId: id
    })

    console.log("hereeeeeeee");
    console.log(notes);

    if (notes){
        res.json({
            message: "Label deleted successfully"
        })
    }else{
        res.status(404).json({
            "message": "Label Not Found"
        })
    }
})

module.exports = router;