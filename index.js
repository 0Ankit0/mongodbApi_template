//Set-ExecutionPolicy RemoteSigned –Scope Process
//run it at the start of the project
import * as dotenv from 'dotenv';
dotenv.config();

import app from "./Routes/route.js"
import Connect from "./Utils/Connection.js"

try {

    const db = await Connect();
    app.listen(process.env.PORT, () => { //put it at the end of the file
        console.log(`listening on port ${process.env.PORT}`)
    })
} catch (err) {
    console.log(err);
}
