// js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    imageUrl: String, // 추후 이미지 업로드 기능 연결 가능
    stock: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
