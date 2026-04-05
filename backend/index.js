import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './utils/db.js';
import cors from 'cors';
import authRouter from './Routes/auth.route.js';
import urlRouter from './Routes/url.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();


app.use(cors(
    {
    origin: 'http://localhost:5173',
    credentials: true,
}
));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.use('/api/auth', authRouter);
app.use('/api/url', urlRouter);

app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.get("/",(_, res)=>{
    res.sendFile(path.join(__dirname, "frontend","dist", "index.html"));
});


connectDb().then(()=>{
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
}).catch((err)=>{
    console.error(`Error connecting to database: ${err.message}`);
})