import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import './App.css'
import HodDashboard from "./pages/HodDashboard";
import FacultyRegister from './components/FacultyRegister';
import CreateStudent from "./components/CreateStudent";
import UploadStudents from "./components/UploadStudents";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashbord from "./pages/StudentDashboard";
import SetPassword from "./pages/SetPassword";

function App() {
  

  return (
  
  <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hod-dashboard" element={<HodDashboard />} />
         <Route path="/facultyregister" element={<FacultyRegister/>}/>
          <Route path="/hod-dashboard" element={<CreateStudent/>}/>
         < Route path="/hod-dashboard" element={< UploadStudents/>}/>
         < Route path="/faculty-dashboard" element={< FacultyDashboard/>}/>
         < Route path="/student-dashboard" element={<  StudentDashbord/>}/>
         <Route path="/set-password" element={<SetPassword />} />

      </Routes>

    </BrowserRouter>
  
  )
}

export default App
