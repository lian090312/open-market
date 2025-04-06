// js

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
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