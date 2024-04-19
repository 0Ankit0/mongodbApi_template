import * as dotenv from 'dotenv';
import http from 'http';
import jwt from 'jsonwebtoken';
import { Message } from './Modals/message.js';
import { Server } from 'socket.io';
dotenv.config();

import app from "./Routes/route.js"
import Connect from "./Utils/Connection.js"

let io;
try {
    const db = await Connect();

    // Create an HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO
    io = new Server(server);

    let userSocketMap = new Map(); // Map to store user ID to socket ID mapping

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('login', (token) => {
            try {
                console.log('Token:', token);
                const user = jwt.verify(token, process.env.JWTSecret);
                const userId = user.id;
                userSocketMap.set(socket.id, { socketId: socket.id, userId }); // Store user ID and socket ID
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

        socket.on('disconnect', () => {
            console.log('Client disconnected');
            // Remove user ID to socket ID mapping on disconnect
            userSocketMap.delete(socket.id);
        });
    });

    server.listen(process.env.PORT, () => {
        console.log(`listening on port ${process.env.PORT}`)
    })
} catch (err) {
    console.log(err);
}

export { io };