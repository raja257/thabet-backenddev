import mongoose from "mongoose";
import { Class } from "../models/class_model.js";

// Create a new Class

const new_class = async (req, resp) => {
  try {
    const class_data = new Class(req.body);
    const save_class = await class_data.save();
    resp
      .status(200)
      .send({ message: `Data saved successfully`, data: save_class });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

// Get class by teacher id
const get_class = async (req, resp) => {
  try {
    const teacher_id = req.body.teacher_id;
    const class_get = await Class.aggregate([
      {
        $match: { teacher_id: new mongoose.Types.ObjectId(teacher_id) },
      },
    ]);
    resp
      .status(200)
      .send({ message: `Data fetched successfully`, data: class_get });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

const get_periods = async (req, resp) => {
  try {
    const teacher_id = req.body.teacher_id;
    const class_get = await Class.aggregate([
      {
        $match: { teacher_id: new mongoose.Types.ObjectId(teacher_id) },
      },
      {
        $unwind: "$subjects",
      },
      {
        $project: {
          class_name: 1,
          "subjects.name": 1,
          "subjects.start_time": 1,
          "subjects.end_time": 1,
        },
      },
    ]);
    resp
      .status(200)
      .send({ message: `Data fetched successfully`, data: class_get });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

// Update Class
const update_class = async (req, resp) => {
  try {
    const class_update = await Class.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    resp
      .status(200)
      .send({ message: `Data updated successfully`, data: class_update });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

// Delete Class
const delete_class = async (req, resp) => {
  try {
    const class_delete = await Class.findByIdAndDelete({ _id: req.params.id });
    resp
      .status(200)
      .send({ message: `Data deleted successfully`, data: class_delete });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

// Get student by class id

const get_student = async (req, resp) => {
  try {
    const class_id = req.body._id;
    const student_get = await Class.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(class_id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "students",
          foreignField: "_id",
          as: "student_detail",
        },
      },
      {
        $unwind: "$student_detail",
      },
      {
        $project: {
          full_name: {
            $concat: [
              "$student_detail.first_name",
              " ",
              "$student_detail.last_name",
            ],
          },
          _id: "$student_detail._id",
        },
      },
    ]);
    resp
      .status(200)
      .send({ message: `Data fetched successfully`, data: student_get });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

// get periods by student id
const get_periods_by_student = async (req, resp) => {
  try {
    const student_id = req.body._id;
    const get_data = await Class.aggregate([
      {
        $match: {
          students: {
            $in: [new mongoose.Types.ObjectId(student_id)],
          },
        },
      },
      {
        $unwind: {
          path: "$subjects",
        },
      },
      {
        $project: {
          start_time: "$subjects.start_time",
          end_time: "$subjects.end_time",
          subject: "$subjects.name",
        },
      },
    ]);
    resp
      .status(200)
      .send({ message: `Data fetched successfully`, data: get_data });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

// add student in student array in grade.

const add_student = async (req, res) => {
  try {
    const { classId, newStudentsIds } = req.body;
    const class_data = await Class.findById(classId);
    const updatedStudentsIds = [
      ...new Set([
        ...class_data?.students?.map((e) => e?.toString()),
        ...newStudentsIds,
      ]),
    ];

    // Update the user's class_id array with the new unique set of IDs
    class_data.students = updatedStudentsIds;

    // Save the updated user document
    await class_data.save();

    res.status(200).json({
      message: "User's class updated successfully",
      data: class_data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating the user's class",
      error: error.message,
    });
  }
};

// remove student from student array in grade.
const remove_student = async (req, res) => {
  try {
    const { classId, studentsId } = req.body;
    const class_data = await Class.findById(classId);

    // Remove the classIdToRemove from the user's class_id array using $pull
    class_data.students.pull(studentsId);

    // Save the updated user document
    await class_data.save();

    res.status(200).json({
      message: "User's class updated successfully",
      data: class_data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating the user's class",
      error: error.message,
    });
  }
};

// Get students by teacher id

const get_student_by_teacher_id = async (req, resp) => {
  try {
    const teacher_id = req.body._id;
    const student_get = await Class.aggregate([
      {
        $match: { teacher_id: new mongoose.Types.ObjectId(teacher_id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "students",
          foreignField: "_id",
          as: "student_detail",
        },
      },
      {
        $unwind: "$student_detail",
      },
      {
        $project: {
          full_name: {
            $concat: [
              "$student_detail.first_name",
              " ",
              "$student_detail.last_name",
            ],
          },
          _id: "$student_detail._id",
        },
      },
    ]);
    resp
      .status(200)
      .send({ message: `Data fetched successfully`, data: student_get });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

// Get teacher by student id

const get_teachers_by_student_id = async (req, resp) => {
  try {
    const student_id = req.body.student_id;

    const teachers = await Class.aggregate([
      {
        $match: {
          students: new mongoose.Types.ObjectId(student_id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "teacher_id",
          foreignField: "_id",
          as: "teacher_detail",
        },
      },
      {
        $unwind: "$teacher_detail",
      },
      {
        $project: {
          teacher_id: "$teacher_detail._id",
          full_name: {
            $concat: [
              "$teacher_detail.first_name",
              " ",
              "$teacher_detail.last_name",
            ],
          },
        },
      },
    ]);
    resp.status(200).send({ message: "Data fetched successfully", teachers });
  } catch (error) {
    resp.status(500).send({ error: error.message });
  }
};

// Get parents by teacher id
const get_parents_of_teacher_id = async (req, resp) => {
  try {
    const teacher_id = req.body.teacher_id;

    const parents = await Class.aggregate([
      {
        $match: {
          teacher_id: new mongoose.Types.ObjectId(teacher_id), 
        },
      },
      {
        $unwind: "$students", 
      },
      {
        $lookup: {
          from: "users", 
          localField: "students",
          foreignField: "_id",
          as: "student_detail",
        },
      },
      {
        $unwind: "$student_detail", 
      },
      {
        $lookup: {
          from: "users", 
          localField: "student_detail._id",
          foreignField: "children",
          as: "parent_detail",
        },
      },
      {
        $unwind: {
          path: "$parent_detail",
        },
      },
      {
        $project: {
          _id: 0,
          parent: {
            parent_id: "$parent_detail._id",
            parent_name: {
              $concat: [
                "$parent_detail.first_name",
                " ",
                "$parent_detail.last_name",
              ],
            },
          },
        },
      },
    ]);

    resp.status(200).send({ message: "Data fetched successfully", parents });
  } catch (error) {
    resp.status(500).send({ error: error.message });
  }
};


export {
  new_class,
  get_class,
  update_class,
  delete_class,
  get_student,
  get_periods,
  get_periods_by_student,
  add_student,
  remove_student,
  get_student_by_teacher_id,
  get_teachers_by_student_id,
  get_parents_of_teacher_id
};
