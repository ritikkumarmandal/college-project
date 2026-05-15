import Attendance from "../models/Attendance.models.js";
import XLSX from "xlsx";

export const downloadAttendanceReport =
  async (req, res) => {

    try {

      console.log("QUERY:", req.query);

      const {
        subjectId,
        type,
        date,
      } = req.query;

      // =========================
      // VALIDATION
      // =========================

      if (!subjectId) {

        return res.status(400).json({
          message: "Subject ID required",
        });

      }

      if (!type) {

        return res.status(400).json({
          message: "Report type required",
        });

      }

      // =========================
      // DATE SETUP
      // =========================

      const selectedDate =
        date
          ? new Date(date)
          : new Date();

      let startDate;
      let endDate;

      // =========================
      // DAILY
      // =========================

      if (type === "daily") {

        if (!date) {

          return res.status(400).json({
            message:
              "Date required for daily report",
          });

        }

        startDate =
          new Date(selectedDate);

        startDate.setHours(
          0,
          0,
          0,
          0
        );

        endDate =
          new Date(selectedDate);

        endDate.setHours(
          23,
          59,
          59,
          999
        );

      }

      // =========================
      // WEEKLY
      // =========================

      else if (
        type === "weekly"
      ) {

        startDate =
          new Date(selectedDate);

        startDate.setDate(
          selectedDate.getDate() -
            selectedDate.getDay()
        );

        startDate.setHours(
          0,
          0,
          0,
          0
        );

        endDate =
          new Date(startDate);

        endDate.setDate(
          startDate.getDate() + 6
        );

        endDate.setHours(
          23,
          59,
          59,
          999
        );

      }

      // =========================
      // MONTHLY
      // =========================

      else if (
        type === "monthly"
      ) {

        startDate =
          new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            1
          );

        endDate =
          new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth() + 1,
            0
          );

        endDate.setHours(
          23,
          59,
          59,
          999
        );

      }

      else {

        return res.status(400).json({
          message:
            "Invalid report type",
        });

      }

      // =========================
      // FETCH RECORDS
      // =========================

      const records =
        await Attendance.find({
          subject: subjectId,
        });

      console.log(
        "TOTAL RECORDS:",
        records.length
      );

      // =========================
      // FILTER RECORDS
      // =========================

      const filteredRecords =
        records.filter((record) => {

          const dbDate =
            new Date(record.date);

          // YYYY-MM-DD
          const dbDateString =
            dbDate
              .toISOString()
              .split("T")[0];

          // DAILY
          if (type === "daily") {

            return (
              dbDateString === date
            );

          }

          // WEEKLY
          else if (
            type === "weekly"
          ) {

            return (
              dbDate >= startDate &&
              dbDate <= endDate
            );

          }

          // MONTHLY
          else if (
            type === "monthly"
          ) {

            return (

              dbDate.getMonth() ===
                selectedDate.getMonth() &&

              dbDate.getFullYear() ===
                selectedDate.getFullYear()

            );

          }

          return false;

        });

      console.log(
        "FILTERED RECORDS:",
        filteredRecords.length
      );

      // =========================
      // NO DATA
      // =========================

      if (
        filteredRecords.length === 0
      ) {

        return res.status(404).json({
          message:
            "No attendance data found",
        });

      }

      // =========================
      // STUDENT SUMMARY
      // =========================

      const studentMap = {};

      filteredRecords.forEach(
        (record) => {

          record.students.forEach(
            (student) => {

              // CREATE ENTRY
              if (
                !studentMap[
                  student.regNumber
                ]
              ) {

                studentMap[
                  student.regNumber
                ] = {

                  Name:
                    student.name,

                  RegistrationNumber:
                    student.regNumber,

                  Department:
                    record.department,

                  Semester:
                    record.semester,

                  TotalClasses: 0,

                  PresentClasses: 0,

                  AbsentClasses: 0,

                };

              }

              // TOTAL
              studentMap[
                student.regNumber
              ].TotalClasses += 1;

              // PRESENT
              if (
                student.status ===
                "Present"
              ) {

                studentMap[
                  student.regNumber
                ].PresentClasses += 1;

              }

              // ABSENT
              else {

                studentMap[
                  student.regNumber
                ].AbsentClasses += 1;

              }

            }
          );

        }
      );

      // =========================
      // FINAL EXCEL DATA
      // =========================

      const excelData =
        Object.values(studentMap).map(
          (student) => ({

            Name:
              student.Name,

            RegistrationNumber:
              student.RegistrationNumber,

            Department:
              student.Department,

            Semester:
              student.Semester,

            TotalClasses:
              student.TotalClasses,

            PresentClasses:
              student.PresentClasses,

            AbsentClasses:
              student.AbsentClasses,

            Percentage:
              (
                (
                  student.PresentClasses /
                  student.TotalClasses
                ) * 100
              ).toFixed(2) + "%",

          })
        );

      console.log(
        "EXCEL DATA:",
        excelData
      );

      // =========================
      // CREATE EXCEL
      // =========================

      const workbook =
        XLSX.utils.book_new();

      const worksheet =
        XLSX.utils.json_to_sheet(
          excelData
        );

      // COLUMN WIDTH
      worksheet["!cols"] = [

        { wch: 25 },

        { wch: 25 },

        { wch: 15 },

        { wch: 12 },

        { wch: 15 },

        { wch: 18 },

        { wch: 18 },

        { wch: 15 },

      ];

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Attendance Report"
      );

      // =========================
      // BUFFER
      // =========================

      const buffer =
        XLSX.write(workbook, {

          type: "buffer",

          bookType: "xlsx",

        });

      // =========================
      // RESPONSE
      // =========================

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${type}-attendance-report.xlsx`
      );

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      return res.send(buffer);

    } catch (error) {

      console.log(
        "DOWNLOAD REPORT ERROR:",
        error
      );

      return res.status(500).json({

        message:
          "Server Error",

        error:
          error.message,

      });

    }

};