import dotenv from "dotenv";

dotenv.config();

if(!process.env.PORT){
    throw new Error("PORT is not defined in .env file");
}
if(!process.env.MONGO_URL){
    throw new Error("MONGO_URL is not defined in .env file");
}
if(!process.env.JWT_SECRET){
    throw new Error("jwt secret is not define in .env file");
}
 if(!process.env.EMAIL){
    throw new Error("EMAIL is not defined in .env file");
 }
 if(!process.env.EMAIL_PASS){
    throw new Error("EMAIL_PASS is not defined in .env file");
 }
const config = {
PORT: process.env.PORT,
MONGO_URL: process.env.MONGO_URL,
JWT_SECRET: process.env.JWT_SECRET,
EMAIL: process.env.EMAIL,
EMAIL_PASS: process.env.EMAIL_PASS
};

export default config;