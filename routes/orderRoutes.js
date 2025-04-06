// js

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const verifyUser = require("../middleware/verifyUser");

// 주문 생성
router.post("/", verifyUser, async (req, res) => {
    try {
        const CartItems = await CartItem.find({ user: req.user._id }).populate("product");

        if (!cartItem.length) {
            return res.status(400).json({ message: "장바구니가 비어 있습니다." });
        }

        let totalPrice = 0;
        const orderItems = [];

        for (const item of cartItems) {
            if (item.quantity > item.product.stock) {
                return res.status(400).json({ message: `${item.product.name}의 재고가 부족합니다.` });
            }

            // 상품 재고 감소
            item.product.stock -= item.quantity;
            await item.product.save();

            orderItems.push({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            });

            totalPrice += item.product.price * item.quantity;
        }

        const order = new Order({
            user: req.user._id,
            items: orderItems,
            totalPrice
        });

        await order.save();

        // 장바구니 비우기
        await CartItem.deleteMany({ user: req.user._id });

        res.status(201).json({ message: "주문이 환료되었습니다.", order });
    } catch (err) {
        res.status(500).json({ message: "주문 생성 실패", error: err.message });
    }
});

// 주문 목록 조회
router.get('/', verifyUser, async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate('items.product', 'name price imageUrl') // 상품 이름, 가격, 이미지만
        .sort({ createdAt: -1 });
  
      res.json({ orders });
    } catch (err) {
      res.status(500).json({ message: '주문 목록 조회 실패', error: err.message });
    }
});

// 주문 상세 조회
router.get('/:id', verifyUser, async (req, res) => {
    try {
      const orderId = req.params.id;
  
      const order = await Order.findOne({
        _id: orderId,
        user: req.user._id // 본인의 주문인지 확인
      }).populate('items.product', 'name price imageUrl description');
  
      if (!order) {
        return res.status(404).json({ message: '주문을 찾을 수 없습니다.' });
      }
  
      res.json({ order });
    } catch (err) {
      res.status(500).json({ message: '주문 상세 조회 실패', error: err.message });
    }
});

module.exports = router;
