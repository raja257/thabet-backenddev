import { User } from "../models/user_model.js";
import { Class } from "../models/class_model.js";
import {
  validate_signup,
  validate_login,
} from "../utils/validation/user_validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Hash password

const secured_password = async (password) => {
  try {
    const hash_password = await bcrypt.hash(password, 10);
    return hash_password;
  } catch (error) {
    console.log(error.message);
  }
};

// Sign Up

const Signup = async (req, resp) => {
  try {
    const { error } = validate_signup(req.body);
    if (error) {
      return resp.status(400).send({ message: error.details[0].message });
    }
    const existing_user = await User.findOne({ email: req.body.email });
    if (existing_user) {
      return resp.status(400).send({ message: "Email already exists" });
    }
    const spassword = await secured_password(req.body.password);
    const user = new User({
      ...req.body,
      password: spassword,
    });
    const save_user = await user.save();
    const token = jwt.sign(
      { id: save_user._id, email: save_user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "10d" }
    );
    return resp.status(200).send({
      message: `User saved successfully`,
      data: save_user,
      token: token,
    });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

const Login = async (req, resp) => {
  try {
    const { error } = validate_login(req.body);
    if (error) {
      return resp.status(400).send({ message: error.details[0].message });
    }
    const { email, password } = req.body;
    const data = await User.findOne({ email: email });
    if (!data) {
      return resp.status(400).send({ message: `Email not found` });
    }
    const is_match = await bcrypt.compare(password, data.password);
    if (!is_match) {
      return resp.status(400).send({ message: `Invalid Password` });
    }
    const token = jwt.sign(
      { id: data._id, email: data.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" }
    );
    return resp.status(200).send({
      message: "Login successful",
      user: data,
      token: token,
    });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

// Upload certificate.

const certificate_upload = async (req, resp) => {
  try {
    const certificate_upload =
      req.file && req.file.filename
        ? `certificates/${req.file.filename}`
        : null;

    if (!certificate_upload) {
      return resp
        .status(400)
        .json({ message: "No certificate file uploaded." });
    }
    const { student_id, teacher_id } = req.body;

    if (!student_id || !teacher_id) {
      return resp
        .status(400)
        .json({ message: "Student ID and Teacher ID are required." });
    }
    const teacher = await User.findById(teacher_id);

    if (!teacher || teacher.role !== "teacher") {
      return resp
        .status(403)
        .json({ message: "Only teachers can upload certificates." });
    }
    const updatedStudent = await User.findByIdAndUpdate(
      student_id,
      { $push: { certificate: certificate_upload } },
      { new: true }
    );

    if (!updatedStudent) {
      return resp.status(404).json({ message: "Student not found." });
    }

    resp.status(200).json({
      message: "Certificate uploaded successfully.",
      data: updatedStudent,
    });
  } catch (error) {
    resp.status(400).json({ error: error.message });
  }
};

// Get Certificate by student id

const get_certificate_by_student_id = async (req, resp) => {
  try {
    const student_id = req.body.student_id;
    const data = await User.aggregate([
      {
        $match:{
          _id: new mongoose.Types.ObjectId(student_id)
        }
      },
      {
        $project:{
          _id: 0,
          certificate: 1
        }
      }
    ]);
    resp.status(200).send({message:"Certificate fetched successfully", data })
  } catch (error) {
    resp.status(400).json({ error: error.message });
  }
}

// Parents can add the student user as a child

const childrens = async (req, resp) => {
  try {
    const { parent_id, student_ids } = req.body;

    if (!Array.isArray(student_ids)) {
      return resp.status(400).send({ error: "student_ids must be an array" });
    }

    const parent = await User.findById(parent_id);
    if (!parent || parent.role !== "parent") {
      return resp.status(400).send({ error: "Parent user not found" });
    }

    const students = await User.find({
      _id: { $in: student_ids },
      role: "student",
    });

    if (students.length !== student_ids.length) {
      return resp
        .status(400)
        .send({ error: "One or more student users not found" });
    }

    for (const student_id of student_ids) {
      const student_objectid = new mongoose.Types.ObjectId(student_id);

      if (!parent.children.some((child) => child.equals(student_objectid))) {
        parent.children.push(student_objectid);
      }
    }

    await parent.save();

    resp.status(200).send({
      message: "Students added as children",
      parent,
    });
  } catch (error) {
    resp.status(400).json({ error: error.message });
  }
};

// Get child by parent id

const get_child = async (req, resp) => {
  try {
    const parent_id = req.body._id;
    const child_get = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(parent_id),
        },
      },
      {
        $unwind: {
          path: "$children",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "children",
          foreignField: "_id",
          as: "childrens",
        },
      },
      {
        $unwind: {
          path: "$childrens",
        },
      },
      {
        $lookup: {
          from: "classes",
          localField: "children",
          foreignField: "students",
          as: "grade",
        },
      },
      {
        $project: {
          name: {
            $concat: ["$childrens.first_name", " ", "$childrens.last_name"],
          },
          grade: {
            $first: "$grade.class_name",
          },
        },
      },
    ]);
    resp
      .status(200)
      .send({ message: `Data fetched successfully`, data: child_get });
  } catch (error) {
    resp.status(400).json({ error: error.message });
  }
};

// Get all students.

const get_students = async (req, resp) => {
  try {
    const students = await User.aggregate([
      {
        $match: { role: "student" },
      },
      {
        $project: {
          name: {
            $concat: ["$first_name", " ", "$last_name"],
          },
        },
      },
    ]);
    resp
      .status(200)
      .send({ message: `Students fetched successfully`, students });
  } catch (error) {
    resp.status(400).json({ error: error.message });
  }
};

// Get childs teacher by parent id.

const get_teachers_by_parent_id = async (req, resp) => {
  try {
    const parent_id = req.body._id;
    const teacher_data = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(parent_id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "children",
          foreignField: "_id",
          as: "children",
        },
      },
      {
        $unwind: {
          path: "$children",
        },
      },
      {
        $lookup: {
          from: "classes",
          localField: "children._id",
          foreignField: "students",
          as: "grade",
        },
      },
      {
        $unwind: {
          path: "$grade",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "grade.teacher_id",
          foreignField: "_id",
          as: "teacher",
        },
      },
      {
        $unwind: {
          path: "$teacher",
        },
      },
      {
        $project: {
          _id: 0,
          teacher: {
            _id: "$teacher._id",
            full_name: {
              $concat: ["$teacher.first_name", " ", "$teacher.last_name"],
            },
          },
        },
      },
    ]);
    resp
      .status(200)
      .send({ message: "Data fetched successfully", teacher_data });
  } catch (error) {
    resp.status(400).json({ error: error.message });
  }
};

// Add Attendence

const add_attendance = async (req, resp) => {
  try {
    const { student_id, date } = req.body;
    const data = await User.findByIdAndUpdate(
      student_id,
      { $push: { attendance: date } },
      { new: true }
    );
    resp.status(200).send({ message: `Attendance done`, data });
  } catch (error) {
    resp.status(400).json({ error: error.message });
  }
};

// Get attendance

const get_attendance = async (req, resp) => {
  try {
    const student_id = req.body.student_id;
    const get_data = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(student_id),
        },
      },
      {
        $project: {
          _id: 0,
          attendance: 1,
        },
      },
    ]);
    resp.status(200).send({ message: `Attendance get successfully`, get_data });
  } catch (error) {
    resp.status(400).json({ error: error.message });
  }
};

export {
  Signup,
  Login,
  certificate_upload,
  get_certificate_by_student_id,
  childrens,
  get_child,
  get_students,
  get_teachers_by_parent_id,
  add_attendance,
  get_attendance,
};
