import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import fileRoutes from './routes/report.js'
import userRoutes from './routes/userRoutes.js';


dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 9000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/api/', fileRoutes);
app.use('/api/', userRoutes);

app.get('/' , (req , res) => {
    res.send('test code')
})



app.listen(port , () => {
    console.log(`Server is up and running at http://localhost:${port}`);
})