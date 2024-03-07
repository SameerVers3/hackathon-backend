const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const auth = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware")
const data = require("./routes/data");
const request = require("./routes/request");

app.use(cors())
app.use(bodyParser.json());
app.use("/auth", auth);
app.use("/data", data);
app.use("/request", request);


app.use ((err, req, res, next)=>{
    res.status(500).json({
        message: "Internal Server Error"
    });
})

app.listen(3000, ()=>{
    console.log("listning");
})