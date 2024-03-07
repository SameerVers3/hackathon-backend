const mongoose = require("mongoose");

const dbName = "test";

mongoose.connect(`mongodb://admin:AZWOp6mxe4AfCygH@ac-oduhene-shard-00-00.6k5ywbl.mongodb.net:27017,ac-oduhene-shard-00-01.6k5ywbl.mongodb.net:27017,ac-oduhene-shard-00-02.6k5ywbl.mongodb.net:27017/${dbName}?replicaSet=atlas-rdvprw-shard-0&ssl=true&authSource=admin`);

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
})

const LabelSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    }
})

const NoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    content: String,
    labels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label'
    }],
    color: String,
    isPinned: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", UserSchema);
const Note = mongoose.model("Note", NoteSchema);
const Label = mongoose.model("Label", LabelSchema);

module.exports = {
    User,
    Note,
    Label
}