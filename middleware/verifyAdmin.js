// js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function verifyAdmin(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "토큰이 필오합니다." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "관리자 권한이 필요합니다." });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "토큰이 유효하지 않습니다." });
    }
};
