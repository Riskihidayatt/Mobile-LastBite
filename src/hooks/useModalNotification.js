import { useDispatch } from "react-redux";
import { showModal } from "../redux/slice/modalSlice";


const useModalNotification = () => {
    const dispatch = useDispatch();

    const showNotification = (data, type = 'info') => {
        dispatch(showModal({
            message: `order in ${data.storeName} is ${data.status}`,
            type: type,
        }));
    };

    return { showNotification };
}

export default useModalNotification