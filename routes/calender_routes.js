import express from "express";
import { create_calender, get_calender } from "../controllers/calender_controller.js";
const calender_routes = express.Router();

calender_routes.post("/create_calender", create_calender);
calender_routes.get("/get_calender", get_calender);

export { calender_routes };
