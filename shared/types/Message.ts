interface Message {
  _id: string;
  senderId: {
    _id: string;
    firstName: string;
  };
  content: string;
  chat: string;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default Message;