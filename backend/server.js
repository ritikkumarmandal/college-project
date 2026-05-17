import express from 'express';
import dotenv from 'dotenv';
import{connectDB} from './config/db.js';
import userRoutes from './routes/user.routes.js';
import studentRoutes from './routes/student.routes.js';
import  facultyroutes from "./routes/faculty.routes.js";
import  subjectRoutes from "./routes/subject.routes.js";
import classAssignRoutes from "./routes/classAssign.routes.js";
import report from "./routes/report.routes.js";
import attendence from "./routes/attendance.routes.js";
import profile from "./routes/profile.routes.js";
import cors from 'cors';
dotenv.config();



const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://college-project-flax-alpha.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(null, true); // TEMP: allow all for debugging
    }
  },
  credentials: true
}));

connectDB();

// simple route
app.use('/api', profile);
app.use('/api/report',report);
app.use('/api',attendence);
app.use('/api/subjects', subjectRoutes);
app.use('/api',facultyroutes );
app.use('/api/students', studentRoutes);
app.use('/api', userRoutes);
//app.use('/api/subjects', subjectRoutes);
app.use('/api',classAssignRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port${PORT}`);
}); 