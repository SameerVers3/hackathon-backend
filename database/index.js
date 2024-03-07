const mongoose = require("mongoose");

const dbName = "payhabib";

mongoose.connect(`mongodb://admin:DaMaYESNFVTQ2jMs@ac-oduhene-shard-00-00.6k5ywbl.mongodb.net:27017,ac-oduhene-shard-00-01.6k5ywbl.mongodb.net:27017,ac-oduhene-shard-00-02.6k5ywbl.mongodb.net:27017/${dbName}?replicaSet=atlas-rdvprw-shard-0&ssl=true&authSource=admin`);

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    acountNumber: Number,
    phone: Number,
    password: String
})

const AdminSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
})


const User = mongoose.model("User", UserSchema);
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = {
    User,
    Admin
}