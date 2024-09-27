import Echo from "laravel-echo";
import { io } from "socket.io-client";

const echo = new Echo({
  broadcaster: "socket.io",
  host: `${process.env.NEXT_PUBLIC_SOCKET_URL}`, // Point to your Laravel Echo Server URL
  client: io,
});

export default echo;
