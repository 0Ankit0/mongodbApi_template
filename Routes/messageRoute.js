import { Router } from "express";
import { Message } from "../Modals/message.js";
import { User } from "../Modals/users.js";
import { userSocketMap } from "../index.js";

const messageRouter = Router();

messageRouter.get('/userList', async (req, res) => {
    var users = await User.aggregate([
        { $match: { _id: { $ne: req.user.id } } },
        {
            $addFields: {
                status: {
                    $cond: {
                        if: { $in: ["$_id", [...userSocketMap.values()].map(socketInfo => socketInfo.userId)] },
                        then: 'online',
                        else: 'offline'
                    }
                }
            }
        }
    ]);

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
