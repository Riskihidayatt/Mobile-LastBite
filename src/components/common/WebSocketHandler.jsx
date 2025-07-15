import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initWebSocketForOrder, disconnectWebSocketForOrder } from "../../utils/websocket";
import useModalNotification from "../../hooks/useModalNotification";

const WebSocketHandler = () => {
  const { showNotification } = useModalNotification();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user && user.id) {
      initWebSocketForOrder(user.id, (userId, data) => {
        showNotification(data, "success");
      });
    }
    return () => {
      if (user && user.id) {
        disconnectWebSocketForOrder(user.id);
      }
    };
  }, [user, dispatch]);

  return null;
};

export default WebSocketHandler;