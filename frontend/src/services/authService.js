import api from "../api"; 

// Register API
export const registerUser = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};



// faculty registaration
export const registerFaculty = async(userData) =>{
  const response = await api.post("/faculty/register", userData);
  return response.data;
  };

  export const loginHod = (data) =>
  api.post("/login", data);

export const loginfaculty = (data) =>
  api.post("/faculty/login", data);

export const createstudent = (data) =>
  api.post("/students/create", data );

 export const uploadStudents = async (file) => {

  const formData = new FormData();

  // backend me upload.single("file") hai
  formData.append("file", file);

  const response = await api.post("/students/upload", formData, {
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
  api.post("/subjects/create", data);

// GET SUBJECTS
export const getSubjects = (department, semester) =>
  api.get(`/subjects?department=${department}&semester=${semester}`);


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
  api.get("/students/students", {
    params: { department, semester }
  });

  export const getFacultySubjects = (department, semester) =>
  api.get(`/faculty/classes?department=${department}&semester=${semester}`);


  // GET ATTENDANCE REPORT
export const getAttendanceReport = (department, semester, subjectId) =>
  api.get("/report", {
    params: { department, semester, subjectId }
  });

  export const loginStudent = (data) =>
  api.post("/students/login", data);

  export const setStudentPassword = (data) =>
  api.post("/students/set-password", data);


  
export const getStudentSubjects = () =>
  api.get("/subjects/student");

export const getStudentAttendance = () =>
  api.get("/students/showattendence");

export const getStudentCalendarAttendance =()=>  api.get(
   `/student/calendar/${subjectId}`
);

export const getAttendanceDates =
  (subjectId) =>
    api.get(
      `/faculty/attendance-dates/${subjectId}`
    );

export const getAttendanceByDate =
  (subjectId, date) =>
    api.get(
      `/faculty/date-attendance/${subjectId}/${date}`
    );

    // services/authService.js

export const downloadReport = (
  subjectId,
  type,
  date
) =>
  api.get(
    `/report/download-report?subjectId=${subjectId}&type=${type}&date=${date}`,
    {
      responseType: "blob",
    }
  );


  export const updateAttendance =
  async (
    attendanceId,
    students
  ) => {

    return axios.put(

      `${API}/update/${attendanceId}`,

      { students }

    );

};