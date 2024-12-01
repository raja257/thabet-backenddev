import mongoose from "mongoose";
const db_name = "Tahbet";

const db_connection = async () => {
  try {
    const connection_instance = await mongoose.connect(
      `${process.env.DB_URI}${db_name}`
    );
    console.log(`DATABASE CONNECTED: ${connection_instance.connection.host}`);
  } catch (error) {
    console.log(" ERROR OCCURS: Error in connecting database ", error.message);
  }
};
export { db_connection };
