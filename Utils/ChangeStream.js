import { EventEmitter } from 'events';
import { User } from '../Modals/users.js';

const eventEmitter = new EventEmitter();

async function setupChangeStream(db) {
    const changeStream = User.watch();
    try {
        changeStream.on('change', (data) => {
            eventEmitter.emit('change', data);
        });
        await closeChangeStream(5000, changeStream);
    } catch (error) {
        console.error("Error occured in change stream", error);
    }
}

eventEmitter.on('change', (change) => {
    console.log('Change detected:', change);
});


function closeChangeStream(timeInMs = 10000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            changeStream.close();
        }, timeInMs);
    })

}
export { setupChangeStream };
