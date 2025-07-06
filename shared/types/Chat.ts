interface Chat {
  _id: string;
  chatName: string; // for group chats, later feature if needed
  isGroupChat: boolean;
  users: {
    _id: string;
    userName: string;
    firstName: string;
    lastName: string;
    phone: string; // maybe for call feature
    avatar: string;
    role: string; // maybe to display associated listing later
  }[];
  latestMessage: {
    _id: string;
    content: string;
    senderId: {
      _id: string;
      firstName: string;
    };
    chat: string;
    readBy: string[];
    createdAt: Date;
  };
  listing?: {
    _id: string;
    title: string;
    images: string[];
    locationId: {
      _id: string;
      city: string;
      state: string;
      country: string;
    };
    time: string;
  };
  groupAdmin: string; // for group chats, later feature if needed
}

export default Chat;
