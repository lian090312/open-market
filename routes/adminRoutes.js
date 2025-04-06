// js

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const product = require("../models/Product");
const bcrypt = require("bcrypt");
const verifyAdmin = require("../middleware/verifyAdmin");

// 관리자용 전체 주문 목록 조회
router.get("/admin/orders", verifyAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
        .populate("user", "username email")
        .populate("items product", "name price imageUrl seller")
        .sort({ createdAt: -1 });

        res.json({ orders });
    } catch (err) {
        res.status(500).json({ message: "전체 주문 조회 실패", error: err.message });
    }
});

// 관리자 계정 생성
router.post("/admin/users", verifyAdmin, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
        }

        const hashed = await bcrypt.hash(password, 10);
        const admin = new User({
            username,
            email,
            password: hashed,
            role: "admin"
        });

        await admin.save();
        res.status(201).json({
            message: "관리자 계정이 생성되었습니다.",
            admin: { id: admin._id, email: admin.email }
        });
    } catch (err) {
        res.status(500).json({ message: "관리자 생성 실패", error: err.message });
    }
});

// 관리자 목록 조회
router.get("/admin/users", verifyAdmin, async (req, res) => {
    try {
        const admins = await User.find({ role: "admin" }).select("-password"); // 비밀번호는 제외
        res.json({ admins });
    } catch (err) {
        res.status(500).json({ message: "관리자 목록 조회 실패", error: err.message });
    }
});

// 관리자 계정 삭제
router.delete("/admin/users/:id", verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // 삭제할 대상이 진짜 관리자 계정인지 확인
        const user = await User.findById(id);
        if (!user || user.role !== "admin") {
            return res.status(404).json({ message: "관리자 계정을 찾을 수 없습니다." });
        }

        // 자기 자신 삭제 방지 (선택사항)
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "자기 자신은 삭제할 수 없습니다." });
        }

        await User.deleteOne({ _id: id });
        res.json({ message: "관리자 계정이 삭제되었습니다." });
    } catch (err) {
        res.status(500).json({ message: "관리자 삭제 실패", error: err.message });
    }
});

module.exports = router;
