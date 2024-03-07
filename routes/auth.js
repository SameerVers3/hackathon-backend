const { Router } = require("express");
const { User, Admin } = require("../database")
const jwt = require("jsonwebtoken");
const router = Router();

const JWT_SECRET = "procom";

const z = require("zod");

const emailSchema = z.string().email();
const passwordSchema = z.string();
const phoneSchema = z.string(); // Example: 1234567890
const accountNumberSchema = z.string(); // Example: "1234567890"
const usernameSchema = z.string();


router.post("/signup", async (req, res) => {
    let remail = req.body.email;
    let rpassword = req.body.password;
    let rphone = req.body.phone;
    let raccountNumber = req.body.accountNumber;
    let rusername = req.body.username;
    
    console.log(raccountNumber);
    let email = emailSchema.safeParse(remail);
    let pass = passwordSchema.safeParse(rpassword);
    let phone = phoneSchema.safeParse(rphone);
    let accountNumber = accountNumberSchema.safeParse(raccountNumber);
    let username = usernameSchema.safeParse(rusername);


    console.log(email);
    console.log(pass);
    console.log(phone);
    console.log(accountNumber);
    console.log(username);

    if (email.success && pass.success && phone.success && accountNumber.success && username.success){
        let user = await User.findOne({
            "email": remail,
            "username": rusername
        })



        if (user){
            res.status(409).json({
                message: "User already Exist"
            })
        }
        else{
            await User.create({
                "email": remail,
                "password": rpassword,
                "phone": rphone,
                "accountNumber": raccountNumber,
                "username": rusername
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
    let username = req.body.username;
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



router.get("/verify", async (req, res) => {
    let token = req.headers.authorization;
    console.log(token)
    if (token){
        try {
            console.log("inside try")
            const data = jwt.verify(token, JWT_SECRET);
            console.log("verified")
            console.log(data)
            res.json({
                username: data.username
            })
        }
        catch (e){
            console.log("inside catch")
            res.status(401).json({
                message: "Invalid Token"
            })
        }
    }
    else {
        res.status(401).json({
            message: "Invalid Token"
        })
    }
})

router.post("/adminlogin", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    const user = await Admin.findOne({
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

router.get("/verify", async (req, res) => {
    let token = req.headers.authorization;
    console.log(token)
    if (token){
        try {
            console.log("inside try")
            const data = jwt.verify(token, JWT_SECRET);
            console.log("verified")
            console.log(data)
            res.json({
                username: data.username
            })
        }
        catch (e){
            console.log("inside catch")
            res.status(401).json({
                message: "Invalid Token"
            })
        }
    }
    else {
        res.status(401).json({
            message: "Invalid Token"
        })
    }
})

module.exports = router;