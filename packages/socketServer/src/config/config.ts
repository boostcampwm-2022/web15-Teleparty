import dotenv from "dotenv";

dotenv.config();

export const ADDRESS = {
  room: process.env.ROOM_ADDRESS || "",
  gartic: process.env.GARTIC_ADDRESS || "",
  catchMind: process.env.CATCHMIND_ADDRESS || "",
};
