import jwt from "jsonwebtoken";

const authemail = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {

      return res.status(401).json({
        message: "No token"
      });

    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODED:", decoded);

    req.user = decoded;

    next();

  } catch (error) {

    console.log("JWT ERROR:", error.message);

    return res.status(403).json({
      message: "Unauthorized"
    });

  }

};

export default authemail;