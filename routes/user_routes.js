import express from "express";
import {
  Signup,
  Login,
  certificate_upload,
  get_certificate_by_student_id,
  childrens,
  get_child,
  get_students,
  get_teachers_by_parent_id,
  add_attendance,
  get_attendance
} from "../controllers/user_controller.js";
import { upload } from "../utils/multer.js";
const user_routes = express.Router();

// SignUP
user_routes.post("/signup", Signup);

// LogIn
user_routes.post("/login", Login);

// Certificate upload
user_routes.post(
  "/certificate_upload",
  upload.single("certificate"),
  certificate_upload
);

// Get certificate
user_routes.post("/get_certificate", get_certificate_by_student_id)

// Children added
user_routes.post("/childrens", childrens);

user_routes.post("/get_child", get_child);

user_routes.get("/get_students", get_students);

user_routes.post("/get_teacher_by_parent_id", get_teachers_by_parent_id);

// Attendance
user_routes.post("/add_attendance", add_attendance);
user_routes.post("/get_attendance", get_attendance);
export { user_routes };
