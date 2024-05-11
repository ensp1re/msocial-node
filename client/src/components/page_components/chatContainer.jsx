import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { MdAddCircleOutline, MdArrowRight } from "react-icons/md";
import Avatar from "../Avatar";
import { FaEllipsisH } from "react-icons/fa";
import Input from "../input";
import Button from "../Button";
import { BiImage } from "react-icons/bi";
import ChatMessage from "../ChatMessage";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { GET_RELATION_ROUTE, SEND_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { data } from "autoprefixer";
import toast from "react-hot-toast";

const ChatContainer = ({ relationInfo }) => {
  const messageEndRef = useRef(null);

  const router = useRouter();

  const [{ userInfo }, dispatch] = useStateProvider();

  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (relationInfo) {
      console.log(relationInfo);
      setSender(relationInfo?.sender);
      setReceiver(relationInfo?.receiver);
      setMessages(relationInfo?.messages);
    }
  }, [relationInfo]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView();
    }
  }, []);

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    try {
      if ((text, sender, receiver)) {
        setLoading(true);
        await axios
          .post(SEND_MESSAGE_ROUTE, {
            relationId: relationInfo?.id,
            receiverId:
              receiver?.id === userInfo?.id ? sender?.id : receiver?.id,
            senderId: userInfo?.id,
            text: text,
          })
          .then((res) => {
            console.log(res.data.data);
            toast.success("Sent");
            router.reload();
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Error");
            setLoading(false);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeText = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="w-full">
      <div className="w-full sticky top-0 flex justify-between items-center p-2 border-b border-b-gray-200 bg-white bg-opacity-95">
        <div className="flex items-center">
          <div
            onClick={() => router.push("/messages")}
            className="rounded-full hover:bg-green-50 transition duration-200 cursor-pointer hover:scale-110"
          >
            <AiOutlineArrowLeft className="text-3xl p-1" />
          </div>
          <div className="flex flec-col">
            <div className="w-full flex gap-3 justify-between text-xl rounded-3xl p-2 items-center">
              <div className="flex flex-row gap-2">
                <Avatar src={receiver?.avatarUrl} type={"sm"} />
                <div className="flex flex-col text-sm">
                  <span className=" text-gray-600 font-semibold">
                    {receiver?.nickname}
                  </span>
                  <span className="text-secondary">@{receiver?.username}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-full hover:bg-green-50 transition duration-200 cursor-pointer hover:scale-110">
          <FaEllipsisH className="text-3xl p-1 text-gray-500" />
        </div>
      </div>
      <div
        className="w-full flex flex-col flex-grow justify-between"
        style={{ height: "calc(103vh - 100px)" }}
      >
        <div className="w-full flex-grow overflow-auto custom-scrollbar">
          {messages?.length ? (
            <div className="w-full flex flex-col px-10 mt-2 gap-2">
              {messages &&
                messages.map((message) => {
                  return (
                    <ChatMessage
                      author={message?.sender}
                      is_receiver={userInfo?.id === message?.receiver?.id}
                      is_sender={userInfo?.id === message?.sender?.id}
                      text={message?.text}
                      time={message?.createdAt}
                    />
                  );
                })}
              <div ref={messageEndRef} />
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <span className="text-lg text-gray-600">No messages</span>
            </div>
          )}
        </div>

        <div className="w-full p-1 z-50 bottom-0 flex flex-row items-center border-t border-t-gray-200">
          <div className="p-1 text-xl rounded-full hover:bg-green-100 transition duration-200 cursor-pointer">
            <BiImage className="text-green-500" />
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex items-center justify-between "
          >
            <div className="w-full">
              <Input
                value={text}
                onChange={handleChangeText}
                text={"Send a message"}
              />
            </div>
            <div>
              <Button
                formType={"submit"}
                icon={loading}
                disabled={loading || !text}
                text={"Post"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
