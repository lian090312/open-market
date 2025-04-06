// js

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifySeller  = require("verifySeller");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// 판매자 인증 미들웨어
const verifySeller = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "토큰이 필요합니다." });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.role !== "seller") return res.status(403).json({ message: "판매자만 접근 가능합니다." });

        req.user - user;
        next();
    } catch (err) {
        res.status(401).json({ message: "인증 실패", error: err.message });
    }
};

// 🔸 로그인한 판매자의 상품만 조회
router.get('/my', verifySeller, async (req, res) => {
    try {
      // 로그인된 판매자의 ID는 req.user._id에 들어 있음
      const products = await Product.find({ seller: req.user._id }).populate('seller', 'username email');
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: '내 상품 조회 실패', error: err.message });
    }
});
  

// 상품 등록 (판매자만 가능)
router.post("/", verifySeller, async (req, res) => {
    try {
        const { name, description, price, imageUrl, stock } = req.body;
        const product = new Product({
            seller: req.user._id,
            name,
            description,
            price,
            imageUrl,
            stock
        });
        await product.save();
        res.status(201).json({ message: "상품 등록 완료", product });
    } catch (err) {
        res.status(500).json({ message: "상품 등록 실패", error: err.message });
    }
});

// 상품 전체 조회
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().populate("seller", "username email");
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "상품 조회 실패", error: err.message });
    }
});

// 특정 상품 조회
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("seller", "username email");
        if (!product) return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "상품 조회 실패", error: err.message });
    }
});

// 특정 판매자의 상품만 조회 (공개용)
router.get('/seller/:sellerId', async (req, res) => {
    try {
      const { sellerId } = req.params;
      const products = await Product.find({ seller: sellerId }).populate('seller', 'username email');
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: '판매자 상품 조회 실패', error: err.message });
    }
  });

// 🔸 로그인한 판매자의 상품만 조회 (관리자 페이지 용도)
router.get('/my', verifySeller, async (req, res) => {
    try {
      const products = await Product.find({ seller: req.user._id }).populate('seller', 'username email');
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: '내 상품 조회 실패', error: err.message });
    }
  });

module.exports = router;
