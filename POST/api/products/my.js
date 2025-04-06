// js

// 🔸 로그인한 판매자의 상품만 조회 (관리자 페이지 용도)
router.get('/my', verifySeller, async (req, res) => {
    try {
      const products = await Product.find({ seller: req.user._id }).populate('seller', 'username email');
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: '내 상품 조회 실패', error: err.message });
    }
  });
  
Authorization: {token}