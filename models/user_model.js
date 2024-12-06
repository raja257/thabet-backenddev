import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["teacher", "student", "parent"],
  },
  certificate: {
    type: [String],
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  class_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  attendance: {
    type: Array,
  },
});

const User = mongoose.model("User", user_schema);
export { User };
