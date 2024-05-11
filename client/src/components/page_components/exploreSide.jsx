import { useCallback, useEffect, useRef, useState } from "react";
import SearchedUsers from "../SearchedUsers";
import Input from "../input";
import axios from "axios";
import { FIND_USERS_ROUTE } from "@/utils/ApiRoutes";
import { FaSpinner } from "react-icons/fa";

const Explore = () => {
  const [dataFoundUsers, setDataFoundUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const handleChangeText = (e) => {
    setKeyword(e.target.value);
  };

  const handleFindUsers = useCallback(() => {
    if (keyword) {
      const findUsers = async () => {
        setLoading(true);
        await axios
          .get(FIND_USERS_ROUTE, {
            params: { keyword: keyword },
          })
          .then((res) => {
            if (res.data.data) {
              setDataFoundUsers(res.data.data);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          })
          .finally(() => setLoading(false));
      };
      findUsers();
    }
  }, [keyword]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && keyword.length && !loading) {
      handleFindUsers();
    } else {
      return;
    }
  };

  const a = [
    {
      username: "enspire",
      avatar: "/logo.png",
      nickname: "Enspire",
      bio: "Hi, follow me!",
    },
    {
      username: "enspire",
      avatar: "/logo.png",
      nickname: "Enspire",
      bio: "Hi, follow me!",
    },
    {
      username: "enspire",
      avatar: "/logo.png",
      nickname: "Enspire",
      bio: "Hi, follow me!",
    },
    {
      username: "enspire",
      avatar: "/logo.png",
      nickname: "Enspire",
      bio: "Hi, follow me!",
    },
    {
      username: "enspire",
      avatar: "/logo.png",
      nickname: "Enspire",
      bio: "Hi, follow me!",
    },
  ];

  return (
    <div className="w-full">
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex p-1 mb-2">
          <Input
            value={keyword}
            onChange={(e) => {
              handleChangeText(e);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div
          className={`w-full h-full flex ${dataFoundUsers ? "flex-col" : ""} ${loading || dataFoundUsers?.length === 0 ? "items-center justify-center mt-[50%]" : ""}`}
        >
          {dataFoundUsers?.length === 0 && !loading && (
            <div className="text-lg text-gray-500">Nothing yet</div>
          )}
          
          {loading && (
            <FaSpinner className="text-lg text-gray-600 animate-spin" />
          )}
          {dataFoundUsers && (
            <>
              {dataFoundUsers.map((user, index) => {
                return (
                  <SearchedUsers
                    key={user?.id}
                    username={user?.username}
                    avatar={user?.avatarUrl}
                    nickname={user?.nickname}
                    bio={user?.bio}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
