// js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// JWT 비밀 키
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// 회원가입
router.post("/register", async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        const exists = await User.findOne({ username });
        if (exists) return res.status(400).json({ message: "이미 존재하는 사용자입니다."});

        const user = new User({ username, password, email, role });
        await user.save();
        res.status(201).json({ message: "회원가입 성공!!!"});
    } catch (err) {
        res.status(500).json({ message: "서버 오류", error: err.message });
    }
});

// 로그인
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "사용자를 찾을 수 없습니다." });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "비밀번호가 일치ㅣ하지 않습니다." });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "id" });
        res.json({ message: "로그인 성공", token });
    } catch (err) {
        res.status(500).json({ message: "서버 오류", error: err.message });
    }
});

module.exports = router;
