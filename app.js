// js

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require('./routes/orderRoutes');
const sellerRoutes = require("./routes/sellerRoutes");

app.use("/api", sellerRoutes); // /api/seller/orders
app.use('/api/orders', orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
const app = express();

// 미들웨어
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// 테스트용 라우터
app.get("/", (req, res) => {
    res.send("오픈마켓 서버 작동중...");
});

// 상품 라우터
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

module.exports = app;
