const express = require("express");

// create express app
const app = express();
const port = 8000;

const usersRouter = require("./routes/usersRouter");
const postsRouter = require("./routes/postsRouter");

// json 형식의 데이터를 파싱하기 위한 미들웨어
app.use(express.json());

// 라우터 등록
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

// listen for requests
app.listen(port, () => {
    console.log("==================== BACKEND SERVER START ====================");
    console.log(`Server running on port ${port}`);
});
