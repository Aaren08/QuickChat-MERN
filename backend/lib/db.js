import mongoose from "mongoose";
import colors from "colors";

// Function to connect to MongoDB
export async function connectDB() {
  try {
    mongoose.connection.on("connected", () => {
      console.log(colors.blue("Connected to MongoDB"));
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
