const jwt = require('jsonwebtoken');

const JWT_SECRET = "procom";

function authMiddleware(req, res, next) {
    const token = req.headers.authorization;

    try {
        console.log(token);
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded){
            console.log("authenticated");
            next();
        }
        else{
            console.log("unauthenticated");
            res.status(403).json({
                message: "Unauthorized"
            })
        }
    }
    catch(e){
        res.json({
            message: "Incorrect Input"
        })
    }
}

module.exports = authMiddleware;