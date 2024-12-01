import mongoose from "mongoose";

const chat_schema = new mongoose.Schema({

})

const Chat = mongoose.model("Chat", chat_schema);
export {
    Chat
}