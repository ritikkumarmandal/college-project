import {
  useState,
} from "react";

import {
  searchStudentAttendance
} from "../services/authService";

const HodStudentAttendance =
  () => {

    const [regNumber,
      setRegNumber] =
      useState("");

    const [data,
      setData] =
      useState(null);

    const [loading,
      setLoading] =
      useState(false);

    const handleSearch =
      async () => {

        if (!regNumber) {

          return alert(
            "Enter registration number"
          );

        }

        try {

          setLoading(true);

          const res =
            await searchStudentAttendance(
              regNumber
            );

          setData(
            res.data
          );

        } catch (error) {

          console.log(error);

          alert(
            "Student not found"
          );

        } finally {

          setLoading(false);

        }

      };

    return (

      <div className="bg-white p-6 rounded-2xl shadow-xl">

        {/* SEARCH */}

        <div className="flex gap-3 mb-6">

          <input
            type="text"
            placeholder="Enter Registration Number"
            value={regNumber}
            onChange={(e) =>
              setRegNumber(
                e.target.value
              )
            }
            className="flex-1 border p-3 rounded-xl outline-none"
          />

          <button
            onClick={
              handleSearch
            }
            className="bg-blue-600 text-white px-6 rounded-xl"
          >

            Search

          </button>

        </div>

        {/* LOADING */}

        {loading && (

          <h2 className="text-xl font-bold">

            Loading...

          </h2>

        )}

        {/* STUDENT */}

        {data && (

          <div>

            {/* INFO */}

            <div className="bg-gray-100 p-5 rounded-2xl mb-6">

              <h2 className="text-2xl font-bold">

                {
                  data.student.name
                }

              </h2>

              <p>

                Registration No:
                {" "}
                {
                  data.student.regNumber
                }

              </p>

              <p>

                Department:
                {" "}
                {
                  data.student.department
                }

              </p>

              <p>

                Semester:
                {" "}
                {
                  data.student.semester
                }

              </p>

            </div>

            {/* SUBJECTS */}

            <div className="grid gap-5">

              {data.attendance.map(
                (
                  sub,
                  index
                ) => (

                  <div
                    key={index}
                    className="border p-5 rounded-2xl"
                  >

                    <h2 className="text-xl font-bold mb-3">

                      {
                        sub.subject
                      }

                    </h2>

                    <div className="grid md:grid-cols-4 gap-4">

                      <div className="bg-blue-100 p-4 rounded-xl">

                        <h3 className="font-bold">

                          Total Classes

                        </h3>

                        <p className="text-2xl">

                          {
                            sub.totalClasses
                          }

                        </p>

                      </div>

                      <div className="bg-green-100 p-4 rounded-xl">

                        <h3 className="font-bold">

                          Present

                        </h3>

                        <p className="text-2xl">

                          {
                            sub.presentClasses
                          }

                        </p>

                      </div>

                      <div className="bg-red-100 p-4 rounded-xl">

                        <h3 className="font-bold">

                          Absent

                        </h3>

                        <p className="text-2xl">

                          {
                            sub.absentClasses
                          }

                        </p>

                      </div>

                      <div className="bg-yellow-100 p-4 rounded-xl">

                        <h3 className="font-bold">

                          Percentage

                        </h3>

                        <p className="text-2xl">

                          {
                            sub.percentage
                          }%

                        </p>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </div>

    );

};

export default HodStudentAttendance;