// js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: ["buyer", "seller", "admin"],
        default: "buyer",
    },
}, { timestamps: true });

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// models/User.js
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["user", "seller", "admin"],
        default: "user"
    }
});

module.exports = mongoose.model("User", userSchema);
