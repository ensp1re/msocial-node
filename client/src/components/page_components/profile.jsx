import Image from "next/image";
import { FaArrowLeft, FaMailBulk, FaSpinner } from "react-icons/fa";
import Avatar from "../Avatar";
import Button from "../Button";
import { useEffect, useState } from "react";
import { typePosts } from "../../../types/constantsEl";
import Post from "../post";
import { useStateProvider } from "@/context/StateContext";
import FollowForm from "../Form/FollowForm";
import { useRouter } from "next/router";
import { IoMdChatboxes } from "react-icons/io";
import { MdMessage } from "react-icons/md";
import { AiFillMessage, AiOutlineMessage } from "react-icons/ai";
import axios from "axios";
import { RELATION_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";

const Profile = ({ user, posts, loading }) => {
  const [isMyPage, setIsMyPage] = useState(true);

  const router = useRouter();

  const [{ userInfo }, dispatch] = useStateProvider();

  useEffect(() => {
    if (user && userInfo) {
      console.log(posts);
      setIsMyPage(user?.username === userInfo?.username);
    }
  }, [user, userInfo]);

  const [selectedTypePost, setSelectedTypePost] = useState({
    selected: "posts",
  });

  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [followerAmount, setFollowerAmount] = useState(0);
  const [followingAmount, setFollowingAmount] = useState(0);

  useEffect(() => {
    if (user) {
      setUsername(user?.username);
      setNickname(user?.nickname);
      setAvatar(user?.avatarUrl);
      setBio(user?.bio);
      setFollowerAmount(user?.followers.length);
      setFollowingAmount(user?.following.length);
    }
  }, [user]);

  const handleChoosePosts = (name) => {
    setSelectedTypePost({ selected: name });
  };

  const handlerRelationMessage = async () => {
    try {
      await axios
        .post(RELATION_ROUTE, {
          senderId: userInfo?.id,
          receiverId: user?.id,
        })
        .then((res) => {
          console.log(res.data.data);
          const RELATION_URL = `/message/${res.data.data.id}`;
          router.push(RELATION_URL);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex w-full h-11 p-2 items-center gap-2 border-b border-b-gray-200 bg-white sticky top-0 z-20 bg-opacity-95">
        <div className="rounded-full p-1 hover:bg-green-50 transition duration-200 cursor-pointer">
          <FaArrowLeft
            onClick={() => router.back()}
            className="text-sm hover:scale-110"
          />
        </div>
        <div className="flex flex-col p-1 mb-1">
          <span className="font-semibold">{nickname}</span>
          <span className="text-sm text-secondary">
            {posts?.posts.length === 0 && `${posts?.posts.length} No posts`}
            {posts?.posts.length === 1 && `${posts?.posts.length} post`}
            {posts?.posts.length > 1 && `${posts?.posts.length} posts`}
          </span>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div className="flex relative w-full h-[200px] overflow-hidden minmax(200px, auto)">
          <Image
            src={"/background.jpg"}
            objectFit="contain"
            layout="responsive"
            width={32}
            height={32}
          />
        </div>
        <div className="flex w-full p-4 flex-col">
          <div className="flex w-full items-center justify-between relative bottom-11">
            <div className="flex rounded-full ring-4  ring-white cursor-pointer transition duration-200">
              <div className="relative">
                <Avatar src={avatar} type={"lg"} />
              </div>
            </div>
            <div className="flex justify-center items-center gap-4">
              {!isMyPage && (
                <div
                  onClick={handlerRelationMessage}
                  className=" rounded-full p-2 cursor-pointer hover:bg-green-50 hover:scale-110"
                >
                  <AiOutlineMessage />
                </div>
              )}
              {isMyPage ? (
                <Button
                  onClick={() => {
                    router.push("/settings");
                  }}
                  text={"Edit profile"}
                  type={"2"}
                />
              ) : (
                <FollowForm followerId={userInfo?.id} followingId={user?.id} />
              )}
            </div>
          </div>
          <div className="w-full flex">
            <div className="flex gap-2">
              <div className="flex flex-col">
                <span className=" text-gray-900 font-semibold">{nickname}</span>
                <span className="text-secondary">@{username}</span>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col text-sm mt-2">
            {/* <p>Actionable insights on Airdrops & DeFi. |</p>
            <br />
            <p>Top 7 on the LayerZero Leaderboard. |</p>
            <br />
            <p>Interoperability Maxi</p>
            <br /> */}
            {bio}
          </div>
          <div className="flex w-full flex-row text-sm gap-3">
            <div className="hover:opacity-75 cursor-pointer transition duration-200 gap-2">
              <span className="text-gray-900 font-semibold">
                {followingAmount}
              </span>
              <span className="text-secondary ml-1">Following</span>
            </div>
            <div className="hover:opacity-75 cursor-pointer transition duration-200 gap-2">
              <span className="text-gray-900 font-semibold">
                {followerAmount}
              </span>
              <span className="text-secondary  ml-1">Followers</span>
            </div>
          </div>
        </div>
        <div>
          <div className="w-full h-11 border-b border-b-gray-200 flex flex-row justify-between sticky top-0 bg-white bg-opacity-95 z-1">
            {Object.entries(typePosts).map(([value, key]) => (
              <div
                key={key}
                onClick={() => handleChoosePosts(key)}
                className={`relative z-10 text-sm w-full flex items-center justify-center hover:bg-gray-100 cursor-pointer transition duration-200 text-gray-600 ${
                  selectedTypePost.selected === key
                    ? "p-2 border-b-2 border-b-green-500 font-bold"
                    : ""
                }`}
              >
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-full overflow-hidden">
        <div
          className={`flex w-full flex-col-reverse ${!posts?.posts.length ? "justify-center items-center mt-[20%]" : ""}`}
        >
          {/* <div className={`flex flex-col-reverse`}> */}
          {selectedTypePost.selected === "posts" &&
            posts &&
            posts?.posts.map((post) => {
              return (
                <Post
                  key={post.id}
                  id={post.id}
                  text={post.text}
                  imageUrl={post.imageUrl}
                  createdAt={post.createdAt}
                  author={post.user}
                  likes={post.likes}
                  reposts={post.reposts}
                  bookmarks={post.bookmarks}
                />
              );
            })}
          {loading && (
            <FaSpinner className="text-lg text-gray-600 animate-spin" />
          )}
          {!posts?.posts.length && (
            <span className="text-lg text-gray-600 ">Nothing here</span>
          )}
          {selectedTypePost.selected === "replies" && (
            <div className="min-w-[550px]">Replies</div>
          )}
          {selectedTypePost.selected === "saved" && (
            <div className="min-w-[550px]">Saved</div>
          )}
          {selectedTypePost.selected === "likes" && (
            <div className="min-w-[550px]">Likes</div>
          )}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
