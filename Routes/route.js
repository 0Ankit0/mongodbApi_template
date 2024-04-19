import express from "express";
import Cors from "cors";
import userRouter from "./userRoute.js";
import { protect } from "../Middleware/auth.js";
import uploadRouter from "./uploadRouter.js";
import mailRouter from "./mailRouter.js";
import { setupChangeStream } from '../Middleware/ChangeStream.js';
import messageRouter from "./messageRoute.js";

var app = express();
app.use(Cors());
app.use(express.json());
app.get("/", async (req, res) => {
    res.send("Welcome to the home page");
});
app.use('/user', setupChangeStream, userRouter);
app.use('/upload', protect, uploadRouter);
app.use('/sendmain', protect, mailRouter);
app.use('/message', protect, messageRouter);
export default app;