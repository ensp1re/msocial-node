import { logout, checkAuth } from "@/utils/auth";
import Input from "../input";
import Suggested from "../suggested";
import { useRouter } from "next/router";
import axios from "axios";
import { useStateProvider } from "@/context/StateContext";
import usePromise from "react-use-promise";
import { ToastBar, Toaster, toast } from "react-hot-toast";
import { GET_ALL_POSTS } from "@/utils/ApiRoutes";

const RightSide = ({ search }) => {
  const router = useRouter();

  const [{ userInfo }, dispatch] = useStateProvider();

  const handleLogout = async () => {
    try {
      await axios
        .get("http://localhost:3005/api/auth/logout", { withCredentials: true })
        .then((res) => {
          console.log(res.data.message);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          router.push("/login");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckAuth = async () => {
    const response = await axios.get(GET_ALL_POSTS, {
      withCredentials: true,
    });
    console.log(response.data);
    console.log(userInfo);
  };

  return (
    <div className="w-full flex flex-col p-3 gap-8 pr-5">
      {search && (
        <div className="flex max-w-[300px]">
          <Input />
        </div>
      )}

      <div className="max-w-[300px] flex flex-col rounded-3xl bg-gray-100">
        <div className="p-2 font-bold">Who to follow</div>
        <div className="flex flex-col items-center">
          <Suggested />
          <Suggested />
          <Suggested />
        </div>
        <div className="p-2 text-sm text-green-500 cursor-pointer hover:opacity-60 transition duration-200">
          Show more
        </div>
        
      </div>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleCheckAuth}>GET</button>
    </div>
  );
};

export default RightSide;
