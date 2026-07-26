import express from "express"
import { updateConversation,createConversation, getConversations, getMessages, saveMessage } from "../controllers/chat.controller.js"

const router = express.Router()

router.get("/create-conversation",createConversation)
router.get("/get-conversations",getConversations)
router.post("/save-message",saveMessage)
router.get("/get-messages/:conversationId",getMessages)
router.post("/update-conversation",updateConversation)

export default router