// js

const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB 연결 성공");
    app.listen(PORT, () => {
        console.log(`서버 실행 중...:https://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("MongoDB 연결 실패:", err.message);
});
