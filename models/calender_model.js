import mongoose from "mongoose";
const calender_schema = new mongoose.Schema({
  title: {
    type: String,
  },
  sub_title: {
    type: String,
  },
  start_time: {
    type: String,
  },
  end_time: {
    type: String,
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const Calender = mongoose.model("Calender", calender_schema);
export { Calender };
