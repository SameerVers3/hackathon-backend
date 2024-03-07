const { Router } = require("express");
const { User } = require("../database")
const jwt = require("jsonwebtoken");
const router = Router();

const JWT_SECRET = "hello";

const z = require("zod");

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);

router.post("/signup", async (req, res) => {
    let userName = req.body.email;
    let password = req.body.password;

    console.log(password);
    let email = emailSchema.safeParse(userName);
    let pass = passwordSchema.safeParse(password);

    console.log(email);
    console.log(pass);
    if (email.success && pass.success){
        let user = await User.findOne({
            "username": userName
        })

        if (user){
            res.status(409).json({
                message: "User Name already Exist"
            })
        }
        else {
            await User.create({
                "username": userName,
                "password": password
            })
    
            res.json({
                message: "User Created Successfully"
            })
        }
    }
    else {
        res.status(400).json({
            message: "Invalid Input"
        })
    }
})

router.post("/login", async (req, res) => {
    let username = req.body.email;
    let password = req.body.password;

    const user = await User.findOne({
        username,
        password
    })

    if (user){
        const token = jwt.sign({
            username
        }, JWT_SECRET);

        res.json({
            token
        })
    }
    else {
        res.status(411).json({
            message: "Incorrect email and password"
        })
    }
})

module.exports = router;