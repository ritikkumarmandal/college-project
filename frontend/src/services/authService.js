import api from "../api"; 

// Register API
export const registerUser = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

// Login API
/*export const loginUser = async (userData) => {
  const response = await api.post("/login", userData);
  return response.data;
};*/

// faculty registaration
export const registerFaculty = async(userData) =>{
  const response = await api.post("/faculty/register", userData);
  return response.data;
  };

  export const loginHod = (data) =>
  api.post("/login", data);

// FACULTY SEND OTP
//export const sendFacultyOtp = (data) =>
  //api.post("/send-otp", data);

// FACULTY VERIFY OTP
//export const verifyFacultyOtp = (data) =>
  //api.post("verify-otp", data);

export const loginfaculty = (data) =>
  api.post("/faculty/login", data);

export const createstudent = (data) =>
  api.post("/create", data );

 export const uploadStudents = async (file) => {

  const formData = new FormData();

  // backend me upload.single("file") hai
  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};


// GET ALL FACULTY
export const getAllFaculty = async () => {
  const response = await api.get("/faculty/all");
  return response.data;
};

// CREATE SUBJECT
export const createSubject = (data) =>
  api.post("/subject/create", data);

// GET SUBJECTS
export const getSubjects = (department, semester) =>
  api.get(`/subject?department=${department}&semester=${semester}`);


// Assign class to faculty
export const assignClass = (data) =>
  api.post("/assign-class", data);

// GET FACULTY CLASSES
export const getFacultyClasses = () =>
  api.get("/faculty/classes");

// MARK ATTENDANCE
export const markAttendance = (data) =>
  api.post("/attendance", data);

export const getStudentsByClass = (department, semester) =>
  api.get("/students", {
    params: { department, semester }
  });

  export const getFacultySubjects = (department, semester) =>
  api.get(`/faculty/classes?department=${department}&semester=${semester}`);


  // GET ATTENDANCE REPORT
export const getAttendanceReport = (department, semester, subjectId) =>
  api.get("/report", {
    params: { department, semester, subjectId }
  });