import { messageModel } from "../models/chat.Model.js";
export class messageManager {
  async getAllMessage() {
    const allMessage = await messageModel.find();
    return allMessage;
  }

  async newMessage(user, message) {
    const newMessage = await messageModel.create({
      user,
      message,
    });
    return newMessage;
  }
}
