import express from "express";
import { new_chat, get_chat } from "../controllers/chat_controller.js";
const chat_routes = express.Router();

chat_routes.post("/new_chat", new_chat)
chat_routes.post("/get_chat", get_chat)

export {
    chat_routes
}