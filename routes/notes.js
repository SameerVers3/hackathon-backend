const { Router } = require("express");
const { User, Note } = require("../database")
const authMiddleware = require('../middleware/authMiddleware');
const jwt = require("jsonwebtoken");
const router = Router();

const searchRoute = require("./search");

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

router.use("/search", searchRoute);

router.get("/", authMiddleware , async (req, res) => {
    const id = await getUserId(req.headers.authorization);

    console.log(id);
    let notes = await Note.find({
        userId: id
    })

    console.log("hereeeeeeee");
    console.log(notes);

    if (notes){
        res.json({
            notes
        })
    }else{
        res.status(404).json({
            "message": "User Not Found"
        })
    }
})



router.post("/", authMiddleware, async (req,res) => {
    const id = await getUserId(req.headers.authorization);

    let title = req.body.title;
    let content = req.body.content;
    let labels = req.body.labels;
    let color = req.body.color;

    await Note.create({
        userId: id,
        title: title,
        content: content,
        labels: labels,
        color: color
    })

    res.json({  
        message: "Note Created Successfully"
    })
})

router.get("/:id", authMiddleware, async (req,res) => {
    try {
        const userid = await getUserId(req.headers.authorization);
        const id = req.params.id;
    
        if (id){
            let notes = await Note.findOne({
                userId: userid,
                _id: id
            })

        
            if (notes){
                res.json(notes)
            }else{
                res.status(404).json({
                    "message": "User Not Found"
                })
            }
        }
    }
    catch (err){
        res.status(404).json({
            message: "Note Not Found"
        });
    }
})

router.delete("/:id", authMiddleware, async (req,res) => {
    try {
        const userid = await getUserId(req.headers.authorization);
        const id = req.params.id;
    
        if (id){
            let deletedNote = await Note.findOneAndDelete({
                _id: id,
                userId: userid
            });

        
            if (deletedNote){
                res.json({
                    message: "Deleted Successfully"
                })
            }else{
                res.status(404).json({
                    "message": "User Not Found"
                })
            }
        }
    }
    catch (err){
        res.status(404).json({
            message: "Note Not Found"
        });
    }
})

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const userid = await getUserId(req.headers.authorization);
        const id = req.params.id;

        console.log("here")
        let title = req.body.title;
        let content = req.body.content;
        let labels = req.body.labels;
        console.log(labels);
        let color = req.body.color;

        console.log(labels);

        if (id) {
            console.log("hereeeeee");
            // Find and update the note based on _id and userId
            let updatedNote = await Note.findOneAndUpdate(
                {
                    _id: id,
                    userId: userid
                },
                {
                    title,
                    content,
                    labels,
                    color
                },
                {
                    new: true
                }
            );

            console.log("hereeeeee2");

            if (updatedNote) {
                console.log("hereeeeee3");
                res.json({
                    message: "Updated Successfully",
                    updatedNote: updatedNote
                });
            } else {
                res.status(404).json({
                    message: "Note Not Found"
                });
            }
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});


// Searching Function

module.exports = router;