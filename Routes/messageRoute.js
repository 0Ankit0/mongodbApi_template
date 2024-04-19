import { Router } from "express";
import { Message } from "../Modals/message.js";
import { User } from "../Modals/users.js";

const messageRouter = Router();

messageRouter.get('/userList', async (req, res) => { //this is /user/index page
    var users = await User.find({ _id: { $ne: req.user.id } }).lean().exec();
    res.json(users);
});

messageRouter.post('/', async (req, res) => { //this is /message/index page
    const messages = await Message.find({
        $or: [
            { sender: req.body.sender, receiver: req.body.receiver },
            { sender: req.body.receiver, receiver: req.body.sender }
        ]
    }).sort({ createdAt: 'desc' }).limit(10).lean().exec();
    res.json(messages);
});





export default messageRouter;
