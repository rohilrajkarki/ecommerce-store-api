const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    { //properties lekhne schema ma
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        img: { type: String }
        // createdAt:Date.now()// yesko satta mongoose ko function xa timestamp vanne

    }, { timestamps: true }) //timestamps taki created at ani updated at vanne aawos

module.exports = mongoose.model("user", UserSchema)