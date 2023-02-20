import { Server } from "http";

export const socketHandlers = async (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("join", async ({ userId }) => {});
  });
};
