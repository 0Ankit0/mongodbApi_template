import { Router } from "express";
import { Message } from "../Modals/message.js";
import { User } from "../Modals/users.js";
import { SocketMap } from "../index.js";
import { ChatGroup } from "../Modals/chatGroup.js";

const messageRouter = Router();

messageRouter.get('/userList', async (req, res) => {
    var users = await User.find({ _id: { $ne: req.user.id } }).lean().exec();

    users.forEach(user => {
        user.status = SocketMap.has(user._id.toString()) ? 'online' : 'offline';
    });
    res.json(users);
});
messageRouter.post('/', async (req, res) => { //this is /message/index page
    const messages = await Message.find({
        $or: [
            { sender: req.user.id, receiver: req.body.receiver },
            { sender: req.body.receiver, receiver: req.user.id }
        ]
    }).sort({ createdAt: 'asc' }).limit(10).lean().exec();
    messages.forEach(message => {
        message.status = (message.sender.toString() === req.user.id.toString()) ? 'sender' : 'receiver'
    })
    res.json(messages);
});
messageRouter.post('/groupMessage', async (req, res) => { //this is /message/index page
    const messages = await Message.find({
        receiver: req.body.receiver
    }).sort({ createdAt: 'asc' }).limit(10).lean().exec();
    messages.forEach(message => {
        message.status = (message.sender.toString() === req.user.id.toString()) ? 'sender' : 'receiver'
    })
    res.json(messages);
});

messageRouter.post('/createGroup', async (req, res) => {
    req.body.members.push(req.user.id);
    const group = await ChatGroup.create({
        ...req.body
    });
    res.status(200).json(group);
})
messageRouter.post('/editGroup', async (req, res) => {
    try {
        req.body.members.push(req.user.id);
        const group = await ChatGroup.findOneAndUpdate(
            { _id: req.body.groupId },
            req.body,
            { new: true }
        ).lean();
        res.status(200).json(group);
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
});


messageRouter.get('/group', async (req, res) => {
    // const group = await ChatGroup.find({ members: req.user.id }).populate('members').lean().exec();
    const group = await ChatGroup.find({ members: req.user.id }).lean().exec();

    res.json(group);
});


export default messageRouter;
