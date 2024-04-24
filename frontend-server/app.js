// import express module
import express from "express";
import path from "path";

// create express app
const app = express();
// define port number
const port = 3000;
// ES module에서는 __dirname 사용 불가
const __dirname = path.resolve();

/* req = request, res = response */

/**
 * 정적 파일 제공을 위한 디렉토리 설정
 * - express.static 미들웨어 가 정적 파일을 제공한다.
 * */
app.use(express.static("public"));

const pages = [
    { route: "/signin", filePath: "user/signin.html" },
    { route: "/signup", filePath: "user/signup.html" },
    { route: "/update-info", filePath: "user/updateInfo.html" },
    { route: "/update-password", filePath: "user/updatePwd.html" },
    { route: "/posts", filePath: "index.html" },
    { route: "/posts/new", filePath: "post/write.html" },
    { route: "/posts/post/detail", filePath: "post/contents.html" },
    { route: "/posts/post/detail/update", filePath: "post/update.html" },
];

pages.forEach((page) => {
    app.get(page.route, (req, res) => {
        res.sendFile(path.join(__dirname, "public/html", page.filePath));
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
