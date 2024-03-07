const jwt = require('jsonwebtoken');

const JWT_SECRET = "hello";

function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    const words = token.split(" ")
    const jwtToken = words[1];

    try {
        const decoded = jwt.verify(jwtToken, JWT_SECRET);
        if (decoded.username){
            console.log("authenticated");
            next();
        }
        else{
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