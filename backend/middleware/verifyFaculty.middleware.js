import jwt from "jsonwebtoken";

export const verifyFaculty = (req, res, next) => {
  try {

    // token cookies ya header se lo
    const token =
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token, access denied"
      });
    }

    // token verify
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // role check
    if (decoded.role !== "FACULTY") {
      return res.status(403).json({
        message: "Faculty access only"
      });
    }

    // user data attach
    req.user = decoded;

    next(); // ✅ controller ko allow

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};     
