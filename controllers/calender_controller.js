import mongoose from "mongoose";
import { Calender } from "../models/calender_model.js";

// Create Calender

const create_calender = async (req, resp) => {
  try {
    const calender_data = new Calender(req.body);
    const save_data = await calender_data.save();
    resp.status(200).send({ message: `Data saved successfuly`, save_data });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

// Get Calender

const get_calender = async (req, resp) => {
  try {
    const teacher_id = req.body._id;
    const now = new Date(req.body.date);

    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);

    startDate.setHours(startDate.getHours() + 5);

    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);
    endDate.setHours(endDate.getHours() + 7);

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    const data = await Calender.aggregate([
      {
        $match: {
          teacher_id: new mongoose.Types.ObjectId(teacher_id),
          start_date: {
            $gte: startDate,
          },
          end_date: {
            $lte: endDate,
          },
        },
      },
    ]);
    resp.status(200).send({ message: `Data fetched successfully`, data });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

export { create_calender, get_calender };
