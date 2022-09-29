import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const user = checkToken(req);
    if (!user)
      return res
        .status(401)
        .json({ ok: false, massege: "You don't permission to this api" });

    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();

    //check if roomId exist
    const roomIndex = rooms.findIndex((x) => x.roomId === roomId);
    if (roomIndex === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });

    //find room and return

    return res.json({ ok: true, messages: rooms[roomIndex].messages });
  } else if (req.method === "POST") {
    //check token
    const user = checkToken(req);
    if (!user)
      return res
        .status(401)
        .json({ ok: false, massege: "You don't permission to this api" });

    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();

    //check if roomId exist
    const roomIndex = rooms.findIndex((x) => x.roomId === roomId);
    if (roomIndex === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });

    //validate body
    if (typeof req.body.text !== "string" || req.body.text.length === 0)
      return res.status(400).json({ ok: false, message: "Invalid text input" });

    //create message
    const newId = uuidv4();
    const newMessage = {
      messageId: newId,
      text: req.body.text,
      username: user.username,
    };
    rooms[roomIndex].messages.push(newMessage);

    writeChatRoomsDB(rooms);
    return res.json({ ok: true, message: newMessage });
  }
}
