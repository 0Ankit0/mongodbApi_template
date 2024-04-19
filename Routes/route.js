import express from "express";
import Cors from "cors";
import userRouter from "./userRoute.js";
import { protect } from "../Middleware/auth.js";
import uploadRouter from "./uploadRouter.js";
import mailRouter from "./mailRouter.js";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';

var app = express();
app.use(Cors());
app.use(express.json());
app.get("/", async (req, res) => {
    try {

        res.status(200).send("Welcome to the home page");
    } catch (error) {
        res.status(401).send(error.message);
    }
});
app.use('/user', userRouter);

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(uploadsDir));
app.use('/upload', protect, uploadRouter);
app.use('/sendmail', protect, mailRouter);
export default app;