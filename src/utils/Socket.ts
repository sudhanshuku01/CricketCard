import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_BASE_URL;
console.log("URL",URL)
const socket = io(URL);

export default socket;
