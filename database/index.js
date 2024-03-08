const mongoose = require("mongoose");

const dbName = "payhabib";

mongoose.connect(`mongodb://admin:DaMaYESNFVTQ2jMs@ac-oduhene-shard-00-00.6k5ywbl.mongodb.net:27017,ac-oduhene-shard-00-01.6k5ywbl.mongodb.net:27017,ac-oduhene-shard-00-02.6k5ywbl.mongodb.net:27017/${dbName}?replicaSet=atlas-rdvprw-shard-0&ssl=true&authSource=admin`);

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    accountNumber: Number,
    phone: Number,
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const PaymentSchema = new mongoose.Schema({
    accountNumber: Number,
    status: String,
    description: String,
    bank: String,
    customer: String,
    amount: Number,
    merchant: Number,
    date: {
        type: Date,
        default: Date.now
    }
})

const MerchantSchema = new mongoose.Schema({
    username: String,
    email: String,
    accountNumber: Number,
    phone: Number,
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const User = mongoose.model("User", UserSchema);
const Merchant = mongoose.model("Merchant", MerchantSchema)
const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = {
    User,
    Merchant,
    Payment
}