import mongoose from "mongoose";

//connecting to DB
const connectDB = async (url) => {
   return mongoose.connect(url)
}

export default connectDB
