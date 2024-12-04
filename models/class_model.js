import mongoose from "mongoose";
const class_schema = new mongoose.Schema(
  {
    class_name: {
      type: String,
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    subjects: [
      {
        name: {
          type: String,
        },
        start_time: {
          type: String,
        },
        end_time: {
          type: String,
        },
      },
    ],
  },
  {
    collection: "classes",
  }
);

const Class = mongoose.model("classes", class_schema);
export { Class };

