import * as dotenv from 'dotenv';

dotenv.config();

import app from "./Routes/route.js"
import Connect from "./Utils/Connection.js"

let io, userSocketMap, SocketMap;
try {
    const db = await Connect();
    app.listen(process.env.PORT, () => {
        console.log(`listening on port ${process.env.PORT}`)
    })
} catch (err) {
    console.log(err);
}

export { io, userSocketMap, SocketMap };