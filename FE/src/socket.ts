// socket.ts
import { io } from "socket.io-client";
import { CONSTANTS } from "./pages/constants";

export const socket = io(CONSTANTS.API_BASE_URL);