const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const auth = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware")
const notes = require("./routes/notes");
const labels = require("./routes/labels");

app.use(cors())
app.use(bodyParser.json());
app.use("/auth", auth);
app.use("/notes", notes);
app.use("/label", labels);

app.use ((err, req, res, next)=>{
    res.status(500).json({
        message: "Internal Server Error"
    });
})

app.listen(3000, ()=>{
    console.log("listning");
})