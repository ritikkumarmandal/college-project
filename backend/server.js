import express from 'express';
import dotenv from 'dotenv';
import{connectDB} from './config/db.js';
import userRoutes from './routes/user.routes.js';
import studentRoutes from './routes/student.routes.js';
import  facultyroutes from "./routes/faculty.routes.js";
import  subjectRoutes from "./routes/subject.routes.js";
import classAssignRoutes from "./routes/classAssign.routes.js";
import cors from 'cors';
dotenv.config();



const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true, // Allow cookies to be sent with requests
}));

connectDB();

// simple route
app.use('/api',facultyroutes );
app.use('/api', studentRoutes);
app.use('/api', userRoutes);
app.use('/api', subjectRoutes);
app.use('/api',classAssignRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 