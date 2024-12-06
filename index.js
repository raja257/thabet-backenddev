import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// DataBase Connection Function
import { db_connection } from "./db/db.js";

// Routes.
import { user_routes } from "./routes/user_routes.js";
import { class_routes } from "./routes/class_routes.js";
import { calender_routes } from "./routes/calender_routes.js";
import { chat_routes } from "./routes/chat_routes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 2000;
db_connection()
  .then(() => {
    console.log(`Server is connected with data base`);
  })
  .catch((error) => {
    console.log(`Error occurs:`, error.message);
  });

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// User
app.use("/user", user_routes);

// Class
app.use("/class", class_routes);

// Calender
app.use("/calender", calender_routes);

// Chat
app.use("/chat", chat_routes);

app.listen(PORT, () => {
  console.log(`Server is listining on ${PORT}`);
});
