//Set-ExecutionPolicy RemoteSigned –Scope Process
//run it at the start of the project
import * as dotenv from 'dotenv';
dotenv.config();

import app from "./Routes/route.js"
import Connect from "./Utils/Connection.js"
import { setupChangeStream } from './Utils/ChangeStream.js';
try {

    const db = await Connect();
    setupChangeStream(db);
    app.listen(process.env.PORT, () => { //put it at the end of the file
        console.log(`listening on port ${process.env.PORT}`)
    })
} catch (err) {
    console.log(err);
}
