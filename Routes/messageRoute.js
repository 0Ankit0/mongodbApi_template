import { Router } from "express";
import { Message } from "../Modals/message.js";


const messageRouter = Router();



messageRouter.post('/', async (req, res) => { //this is /message/index page
    const messages = await Message.find({
        $or: [
            { sender: req.body.sender, receiver: req.body.receiver },
            { sender: req.body.receiver, receiver: req.body.sender }
        ]
    }).sort({ createdAt: 'asc' }).lean().exec();
    res.json(messages);
});





export default messageRouter;
