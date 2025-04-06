// js

const express = require("express");
const router = express.Router();
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 사용자 인증 미들웨어
const verifyUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "토큰이 필요합니다." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
        const user = await User.findById(decoded.id);
        if (!user) return res.status(403).json({ message: "유효하지 않은 사용자입니다." });

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "인증 실패", error: err.message });
    }
};

// 장바구니에 상품 추가
router.post('/', verifyUser, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
  
// 상품 존재 여부 확인
        const product = await Product.findById(productId);
        if (!product) {
        return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
}
  
// 이미 장바구니에 있는지 확인
    let cartItem = await CartItem.findOne({
        user: req.user._id,
        product: productId
    });
  
        if (cartItem) {
// 수량만 증가
    cartItem.quantity += quantity ?? 1;
        } else {
// 새로 추가
    cartItem = new CartItem({
        user: req.user._id,
        product: productId,
        quantity: quantity ?? 1
        });
    }
  
        await cartItem.save();
  
    res.status(201).json({ message: '장바구니에 상품이 추가되었습니다.', cartItem });
        } catch (err) {
    res.status(500).json({ message: '장바구니 추가 실패', error: err.message });
        }
    });

// 장바구니 조회
router.get('/', verifyUser, async (req, res) => {
    try {
      const cartItems = await CartItem.find({ user: req.user._id })
        .populate('product', 'name price imageUrl stock') // 상품 정보 일부만 가져오기
        .sort({ createdAt: -1 });
  
      res.json({ cartItems });
    } catch (err) {
      res.status(500).json({ message: '장바구니 조회 실패', error: err.message });
    }
  });
  
// 장바구니 수량 수정
router.put('/:itemId', verifyUser, async (req, res) => {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;
  
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: '수량은 1 이상이어야 합니다.' });
      }
  
      const cartItem = await CartItem.findOne({
        _id: itemId,
        user: req.user._id
      });
  
      if (!cartItem) {
        return res.status(404).json({ message: '장바구니 항목을 찾을 수 없습니다.' });
      }
  
      cartItem.quantity = quantity;
      await cartItem.save();
  
      res.json({ message: '수량이 수정되었습니다.', cartItem });
    } catch (err) {
      res.status(500).json({ message: '수량 수정 실패', error: err.message });
    }
  });
  
// 장바구니 항목 삭제
router.delete('/:itemId', verifyUser, async (req, res) => {
    try {
      const { itemId } = req.params;
  
      const cartItem = await CartItem.findOneAndDelete({
        _id: itemId,
        user: req.user._id
    });
  
      if (!cartItem) {
        return res.status(404).json({ message: '장바구니 항목을 찾을 수 없습니다.' });
      }
  
      res.json({ message: '장바구니 항목이 삭제되었습니다.' });
    } catch (err) {
      res.status(500).json({ message: '장바구니 삭제 실패', error: err.message });
    }
});
  

module.exports = router;
