import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { AiOutlineMessage } from "react-icons/ai";
import { MdAddCircleOutline } from "react-icons/md";
import Input from "../input";
import ChatUser from "../chatUser";
import { useCallback } from "react";
import { useRouter } from "next/router";

const Messages = ({ relations }) => {
  const [{}, dispatch] = useStateProvider();

  const router = useRouter();

  return (
    <div className="w-full h-full overflow-auto custom-scrollbar">
      <div className="w-full sticky top-0 z-50 flex justify-between items-center p-2 border-b border-b-gray-200 bg-white bg-opacity-95">
        <div className="">
          <span className="text-gray-800 font-semibold text-lg">Messages</span>
        </div>
        <div className="rounded-full hover:bg-green-50 transition duration-200 cursor-pointer hover:scale-110">
          <MdAddCircleOutline className="text-3xl p-1" />
        </div>
      </div>
      <div className="w-full flex flex-col items-center mt-3 ">
        <div className="w-full p-2">
          <Input text={"Search Direct Messages"} />
        </div>
        <div className="w-full mt-2">
          {relations &&
            relations.map((relation) => {
              return (
                <ChatUser
                  username={relation?.receiver?.username}
                  avatar={relation?.receiver?.avatarUrl}
                  nickname={relation?.receiver?.nickname}
                  lastMessage={
                    relation?.messages[relation?.messages?.length - 1]?.text
                  }
                  isSeen={true}
                  onClick={() => {
                    const RELATION_URL = `/message/${relation?.id}`;
                    router.push(RELATION_URL);
                  }}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Messages;
