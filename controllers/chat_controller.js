import mongoose from "mongoose";
import { Chat } from "../models/chat_model.js";

// Create new or Add new messsage
const new_chat = async (req, resp) => {
  try {
    const { logged_in_user, other_user, message } = req.body;
    let chat = await Chat.findOne({
      participant: { $all: [logged_in_user, other_user] },
    });
    if (chat) {
      chat.messages.push({ sender_id: logged_in_user, message });
      await chat.save();
      return resp
        .status(200)
        .send({ message: "Message added in Chat successfully", chat });
    } else {
      chat = new Chat({
        participant: [logged_in_user, other_user],
        messages: [{ sender_id: logged_in_user, message }],
      });
    }
    await chat.save();
    return resp
      .status(200)
      .send({ message: "Chat created successfully", chat });
  } catch (error) {
    return resp.status(400).send(error.message);
  }
};

// Get messages

const get_chat = async (req, resp) => {
  try {
    const { logged_in_user, other_user } = req.body;

    const data = await Chat.aggregate([
      {
        $match: {
          participant: {
            $all: [
              new mongoose.Types.ObjectId(logged_in_user),
              new mongoose.Types.ObjectId(other_user),
            ],
          },
        },
      },
      {
        $project: {
          _id: 0, 
          messages: {
            $map: {
              input: "$messages",
              as: "message",
              in: "$$message.message", 
            },
          },
        },
      },
    ]);

    return resp
      .status(200)
      .send({ message: "Chat fetched successfully", data });
  } catch (error) {
    return resp.status(400).send(error.message);
  }
};

export { new_chat, get_chat };
