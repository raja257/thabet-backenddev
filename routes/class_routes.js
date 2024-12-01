import express from "express";
const class_routes = express.Router();
import {
  new_class,
  get_class,
  update_class,
  delete_class,
  get_student,
  get_periods,
  get_periods_by_student,
  add_student,
  remove_student
} from "../controllers/class_controller.js";

class_routes.post("/new_class", new_class);
class_routes.post("/get_class", get_class);
class_routes.post("/get_periods", get_periods);
class_routes.post("/get_student", get_student);
class_routes.post("/get_periods_by_student", get_periods_by_student);
class_routes.patch("/update_class/:id", update_class);
class_routes.delete("/delete_class/:id", delete_class);
class_routes.post("/add_student", add_student);
class_routes.post("/remove_student", remove_student)

export { class_routes };
