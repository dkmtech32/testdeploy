import { io } from "socket.io-client";

const socket = io('http://localhost:6001'); // Replace with your backend URL and port

export default socket;
