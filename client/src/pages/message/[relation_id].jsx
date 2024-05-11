import Base from "@/components/base";
import ChatContainer from "@/components/page_components/chatContainer";
import { useStateProvider } from "@/context/StateContext";
import { GET_RELATION_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const Message = () => {
  const router = useRouter();

  const [{ userInfo }] = useStateProvider();

  const { relation_id } = router.query;

  const [relation, setRelation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getRelation = async () => {
      setLoading(true);
      await axios
        .get(GET_RELATION_ROUTE, {
          params: {
            relationId: relation_id,
          },
        })
        .then((res) => {
          setRelation(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    getRelation();
  }, [relation_id]);

  return (
    <Base>
      <div
        className={`w-full md:flex lg:flex ${loading ? "h-full justify-center items-center" : ""}`}
      >
        {loading && !relation ? (
          <FaSpinner className="text-lg text-gray-600 animate-spin" />
        ) : (
          <ChatContainer relationInfo={relation} />
        )}
      </div>
    </Base>
  );
};

export default Message;
