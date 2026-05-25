import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


export const authFaculty =
  (req, res, next) => {

    try {

      const token =
        req.headers.authorization
          ?.split(" ")[1];

      if (!token) {

        return res.status(401)
          .json({

            message:
              "Token missing",

          });

      }

      const decoded =
        jwt.verify(

          token,

          process.env.JWT_SECRET

        );

      // FACULTY + HOD
      if (

        decoded.role !==
          "FACULTY" &&

        decoded.role !==
          "HOD"

      ) {

        return res.status(403)
          .json({

            message:
              "Faculty/HOD only",

          });

      }

      req.user = decoded;

      next();

    } catch (error) {

      res.status(401).json({

        message:
          "Invalid token",

      });

    }

};