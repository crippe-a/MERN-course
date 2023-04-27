import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import morgan from "morgan";

// db and authenticateUser
import connectDB from "./database/connect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRoutes.js";

// midleware
import notFoundMiddleWare from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
if(process.env.NODE_ENV !== "production"){
    app.use(morgan("dev"));
}
app.use(express.json());

import authenticateUser from "./middleware/auth.js";

app.get("/api/v1", (req,res)=>{
    res.send({message: "Welcome!"}).status(200);
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 5000;



const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, ()=>{
            console.log(`Server listening on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();
