import jwt from "jsonwebtoken";
const authemail = (req, res, next) => {
  try {

    

    const authHeader = req.headers.authorization;

   

    if (!authHeader) {
      return res.status(401).json({
        message: "No token"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    console.log(error.message);

    return res.status(403).json({
      message: "Unauthorized"
    });
  }
};

export default authemail;