import express from "express";
const router = express.Router();

/* GET posts listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

console.log("posts.js");

export default router;
