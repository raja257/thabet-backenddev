import mongoose from "mongoose";

const chat_schema = new mongoose.Schema({
  participant: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      message: {
        type: String,
      },
    },
  ],
});

const Chat = mongoose.model("Chat", chat_schema);
export { Chat };
