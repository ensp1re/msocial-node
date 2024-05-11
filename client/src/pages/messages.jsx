import Base from "@/components/base";
import ChatContainer from "@/components/page_components/chatContainer";
import Messages from "@/components/page_components/message";
import { useStateProvider } from "@/context/StateContext";
import { ALL_RELATIONS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const MessagesPage = () => {
  const [relations, setRelations] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllRelations = async () => {
      setLoading(true);
      await axios
        .get(ALL_RELATIONS_ROUTE)
        .then((res) => {
          console.log(res.data.data);
          setRelations(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    getAllRelations();
  }, []);

  return (
    <Base>
      <div className="w-full h-screen flex flex-row">
        <div
          className={`w-full flex border-r border-r-gray-200  custom-scrollbar ${loading ? "h-full justify-center items-center" : ""}`}
        >
          {loading && !relations ? (
            <FaSpinner className="text-lg text-gray-600 animate-spin" />
          ) : (
            <Messages relations={relations} />
          )}
        </div>
        <div className={`w-full hidden md:flex lg:flex `}>
          <div className="w-full flex justify-center items-center">
            <span className="text-gray-900 font-semigold text-xl">
              Select a message
            </span>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default MessagesPage;
