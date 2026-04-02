import { useState } from "react";
import { uploadStudents } from "../services/authService";

function Uploadstudents() {

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // file select
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  // upload file
  const handleUpload = async () => {

    if (!file) {
      setMessage("❌ Please select a file first");
      return;
    }

    try {
     
      const res = await uploadStudents(file);
      
      setMessage(`✅ ${res.message} (${res.total} students)`);

      setFile(null);

    } catch (error) {
      console.error(error);
      setMessage("❌ Upload failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-xl">

      <h2 className="text-xl font-semibold mb-6">
        Upload Students (Excel / CSV)
      </h2>

      {/* Select File */}
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="mb-4"
      />

      {/* Buttons */}
      <div className="flex gap-4">

        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Upload File
        </button>

      </div>

      {/* Message */}
      {message && (
        <p className="mt-4 font-medium">{message}</p>
      )}

    </div>
  );
}

export default Uploadstudents;