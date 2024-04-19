import { EventEmitter } from 'events';
import { User } from '../Modals/users.js';

const eventEmitter = new EventEmitter();

const setupChangeStream = async (req, res, next) => {
    const changeStream = User.watch();
    try {
        changeStream.on('change', (data) => {
            eventEmitter.emit('change', data);
        });
        next();
    } catch (error) {
        console.error("Error occurred in change stream", error);
        res.status(500).send('Error occurred while setting up change stream');
    }
}

eventEmitter.on('change', (change) => {
    console.log('Change detected:', change);
});

export { setupChangeStream };