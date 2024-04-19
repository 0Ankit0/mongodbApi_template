import express from "express";
import Cors from "cors";
import userRouter from "./userRoute.js";
import { protect } from "../Middleware/auth.js";
import uploadRouter from "./uploadRouter.js";
import mailRouter from "./mailRouter.js";

var app = express();
app.use(Cors());
app.use(express.json());
app.get("/", async (req, res) => {
    res.send("Welcome to the home page");
});
app.use('/user', protect, userRouter);
app.use('/upload', uploadRouter);
app.use('/sendmain', mailRouter);
export default app;