import * as dotenv from 'dotenv';
import http from 'http';
import jwt from 'jsonwebtoken';
import { Message } from './Modals/message.js';
import { User } from './Modals/users.js';
import { Server } from 'socket.io';
dotenv.config();

import app from "./Routes/route.js"
import Connect from "./Utils/Connection.js"

let io, userSocketMap;
try {
    const db = await Connect();

    // Create an HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO
    io = new Server(server, {
        cors: {
            origin: "*", // Allow all origins
            methods: ["*"] // Allow all methods
        }
    });

    userSocketMap = new Map(); // Map to store user ID to socket ID mapping

    io.on('connection', (socket) => {

        socket.on('login', (token) => {
            try {
                const user = jwt.verify(token, process.env.JWTSecret);
                const userId = user.id;
                userSocketMap.set(socket.id, { socketId: socket.id, userId }); // Store user ID and socket ID
                socket.emit('loginSuccessful');
            } catch (error) {
                console.log('Error verifying JWT:', error);
            }
        });

        socket.on('message', async (data) => {
            const { receiverId, message } = data;
            const receiverSocket = userSocketMap.get(receiverId);
            const senderSocket = userSocketMap.get(socket.id);
            if (receiverSocket) {
                socket.to(receiverSocket.socketId).emit('message', message);

                try {
                    Message.create({
                        message: message,
                        sender: senderSocket.userId,
                        receiver: receiverId
                    });
                } catch (error) {
                    console.log('Error saving message to database:', error);
                }
            }
        });


        socket.on('logout', () => {
            console.log('Client logged out')
            User.findByIdAndUpdate(userSocketMap.get(socket.id).userId, { lastActive: new Date() });
            userSocketMap.delete(socket.id);
        });
    });

    server.listen(process.env.PORT, () => {
        console.log(`listening on port ${process.env.PORT}`)
    })
} catch (err) {
    console.log(err);
}

export { io, userSocketMap };