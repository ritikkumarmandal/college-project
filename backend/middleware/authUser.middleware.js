import jwt from "jsonwebtoken";

export const authUser =
  async (req, res, next) => {

    try {

      let token =
        req.headers.authorization;

      // TOKEN CHECK
      if (!token) {

        return res.status(401).json({
          message:
            "No token provided",
        });

      }

      // REMOVE Bearer
      if (
        token.startsWith(
          "Bearer "
        )
      ) {

        token =
          token.split(" ")[1];

      }

      // VERIFY TOKEN
      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      // SAVE USER
      req.user = decoded;

      next();

    } catch (error) {

      console.log(error);

      res.status(401).json({
        message:
          "Unauthorized",
      });

    }

};