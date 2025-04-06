// js

// 판매자용 주문 조회
router.get('/seller/orders', verifySeller, async (req, res) => {
    try {
      const orders = await Order.find()
        .populate('user', 'username email') // 주문한 사용자 정보
        .populate({
          path: 'items.product',
          match: { seller: req.user._id }, // 내 상품만
          select: 'name price imageUrl seller'
        })
        .sort({ createdAt: -1 });
  
      // 상품이 없는 주문은 제외 (즉, 내 상품이 하나도 안 들어간 주문은 제거)
      const filteredOrders = orders.filter(order =>
        order.items.some(item => item.product) // product가 null이 아닌 경우
      );
  
      res.json({ orders: filteredOrders });
    } catch (err) {
      res.status(500).json({ message: '판매자 주문 조회 실패', error: err.message });
    }
});
