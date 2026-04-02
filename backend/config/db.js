import mongoose from 'mongoose';

export const connectDB= async()=>
{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("db coonected successfully");
    }
    catch(err)
    {
       console.log("db  coonection failed");
       console.error(err);
       process.exit(1);
    }
}