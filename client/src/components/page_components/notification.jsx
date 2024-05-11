import { MdAddCircleOutline } from "react-icons/md";
import NotificationDiv from "../notificationDiv";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import { GET_NOTIFICATION_ROUTE } from "@/utils/ApiRoutes";

const Notification = () => {
  const router = useRouter();

  const [notifications, setNotifications] = useState(null);
  const [loading, setLoading] = useState(false);

  const [{ userInfo }] = useStateProvider();

  useEffect(() => {
    if (userInfo) {
      setLoading(true);
      const getNotifications = async () =>
        await axios
          .post(GET_NOTIFICATION_ROUTE, {
            user_id: userInfo?.id,
          })
          .then((res) => {
            console.log(res.data.data);
            setNotifications(res.data.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });

      getNotifications();
    }
  }, [userInfo]);

  return (
    <div className="w-full h-full overflow-auto custom-scrollbar">
      <div className="w-full sticky top-0 z-50 flex justify-between items-center p-2 border-b border-b-gray-200 bg-white bg-opacity-95">
        <div className="">
          <span className="text-gray-800 font-semibold text-lg">
            Notifications
          </span>
        </div>
        <div className="rounded-full hover:bg-green-50 transition duration-200 cursor-pointer hover:scale-110">
          <MdAddCircleOutline className="text-3xl p-1" />
        </div>
      </div>
      <div className="w-full flex flex-col items-center mt-3 ">
        <div className="w-full flex flex-col gap-2">
          {notifications &&
            notifications.map((notif) => {
              return (
                <NotificationDiv
                  sender={notif?.sender}
                  text={notif?.text}
                  // type={"post"}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Notification;
