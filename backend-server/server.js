const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

require("dotenv").config();
const port = process.env.PORT;

const usersRouter = require("./routes/usersRouter");
const postsRouter = require("./routes/postsRouter");

// json 형식의 데이터를 파싱하기 위한 미들웨어
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

// 정적 파일 제공
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 라우터 등록
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

// listen for requests
app.listen(port, () => {
    console.log("==================== BACKEND SERVER START ====================");
    console.log(`Server running on port ${port}`);
});
