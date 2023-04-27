import {readFile} from "fs/promises";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./database/connect.js";
import Job from "./models/Job.js";

const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URL);
        Job.deleteMany();
        const jsonProducts = JSON.parse(await readFile(new URL("./MOCK_DATA.json", import.meta.url)));
        await Job.create(jsonProducts);
        console.log("Success");
        process.exit(0);

    } catch (error) {
        console.log(error);
        console.log("something went wrong");
        process.exit(1);
    }
}


//start();