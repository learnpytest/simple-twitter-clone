import socket from "../main";

import {
  displayOneRoomMessages,
  displayLatestPrivateRoomMessages,
} from "./socketEventTypes";

export default {
  // @params roomId:String, currentUser:Object, otherUser:Object
  // @return socket event
  async emitDisplayOneRoomMessages(roomId, currentUser, otherUser) {
    await socket.emit(displayOneRoomMessages, {
      roomId,
      currentUser,
      otherUser,
    });
  },
  async emitDisplayLatestPrivateRoomMessages(currentUser) {
    await socket.emit(displayLatestPrivateRoomMessages, currentUser);
  },
};
