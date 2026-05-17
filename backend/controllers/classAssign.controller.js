import ClassAssign from "../models/classAssign.models.js";
export const assignClass =
  async (req, res) => {

    try {

      const {

        department,

        semester,

        subject,

        faculty,

        assignedRole,

      } = req.body;

      // ALREADY EXISTS
      const exists =
        await ClassAssign.findOne({

          subject,

          semester,

        });

      if (exists) {

        return res.status(400)
          .json({

            message:
              "Class already assigned",

          });

      }

      // PAYLOAD
      const payload = {

        department,

        semester,

        subject,

        assignedRole,

      };

      // FACULTY
      if (
        assignedRole ===
        "Faculty"
      ) {

        payload.faculty =
          faculty;

      }

      // HOD
      else {

        payload.hod =
          req.user.id;

      }

      // CREATE
      const assign =
        await ClassAssign.create(
          payload
        );

      res.status(201).json({

        success: true,

        message:
          "Class Assigned Successfully ✅",

        assign,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

};