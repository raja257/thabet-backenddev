import express from "express";
import {
  Signup,
  Login,
  certificate_upload,
  childrens,
  get_child,
  get_students,
  get_teachers_by_parent_id,
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

// Children added
user_routes.post("/childrens", childrens);

user_routes.post("/get_child", get_child);

user_routes.get("/get_students", get_students);

user_routes.post("/get_teacher_by_parent_id", get_teachers_by_parent_id);

export { user_routes };
