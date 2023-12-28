import mongoose from "mongoose";
import colors from "colors";


export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
        })
        console.log(` MongoDB Connected: ${conn.connection.host} `.bgCyan.black)
    } catch (error) {
        console.log(` Error: ${error.message} `.bgRed.black)
        process.exit(1)
    }
}