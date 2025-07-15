import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WEBSOCKET_URL = "http://10.10.102.131:8080/ws";
let clients = {};

export const initWebSocketForOrder = (userId, onMessage) => {
  if (clients[userId]) return;

  const client = new Client({
    webSocketFactory: () => new SockJS(WEBSOCKET_URL),
    onConnect: () => {
      client.subscribe(`/topic/customer/${userId}`, (message) => {
        const data = JSON.parse(message.body);
        onMessage(userId, data);
      });
    },
  });

  client.activate();
  clients[userId] = client;
};

export const disconnectWebSocketForOrder = (userId) => {
  if (clients[userId]) {
    clients[userId].deactivate();
    delete clients[userId];
  }
};
