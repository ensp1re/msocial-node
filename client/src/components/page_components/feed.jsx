import { useEffect, useState } from "react";
import Avatar from "../Avatar";
import Post from "../post";
import { useStateProvider } from "@/context/StateContext";
import PostForm from "../Form/PostForm";
import axios from "axios";
import { GET_ALL_POSTS } from "@/utils/ApiRoutes";
import { FaSpinner } from "react-icons/fa";
import { shuffleArray } from "@/utils/shuffleArray";

const Feed = () => {
  const [isFeed, setIsFeed] = useState(true);
  const [{ userInfo }, dispatch] = useStateProvider();
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    const get_posts = async () => {
      const response = await axios.get(GET_ALL_POSTS, {
        withCredentials: true,
      });
      setPosts(response.data.data);
    };
    get_posts();
  }, []);

  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    setAvatar(userInfo?.profileImage);
  }, [userInfo]);

  const handleFeed = () => {
    setIsFeed(true);
  };

  const handleFollowing = () => {
    setIsFeed(false);
  };

  return (
    <div className="w-full">
      <div className="w-full h-11 border-b border-b-gray-200 flex flex-row justify-between sticky top-0 bg-white bg-opacity-95 z-1">
        <div
          onClick={handleFeed}
          className="relative z-10 text-sm w-full flex items-center justify-center hover:bg-gray-100 cursor-pointer transition duration-200 text-gray-600"
        >
          <span
            className={`${isFeed ? "p-2 border-b-2 border-b-green-500 font-bold" : ""}`}
          >
            Feed
          </span>
        </div>
        <div
          onClick={handleFollowing}
          className="w-full flex items-center justify-center hover:bg-gray-100 cursor-pointer transition duration-200 text-gray-600"
        >
          <span
            className={`${isFeed ? "" : "p-2 border-b-2 border-b-green-500 font-bold"}`}
          >
            Following
          </span>
        </div>
      </div>
      <div className="w-full">
        {/* post */}
        <div className="w-full p-3 flex border-b border-b-gray-200 flex-row">
          <div className="relative">
            <Avatar src={avatar} type={"md"} />
          </div>
          <PostForm />
        </div>
        {/* feed */}
        <div className="flex w-full">
          <div
            className={`w-full flex flex-col-reverse ${posts ? "" : "justify-center items-center mt-[30%]"}`}
          >
            {posts ? (
              posts.map((post) => {
                return (
                  <Post
                    key={post.id}
                    author={post.user}
                    id={post.id}
                    text={post.text}
                    imageUrl={post.imageUrl}
                    createdAt={post.createdAt}
                    likes={post.likes}
                  s  reposts={post.reposts}
                    bookmarks={post.bookmarks}
                    post={post}
                  />
                );
              })
            ) : (
              <FaSpinner className="text-lg text-gray-600 animate-spin" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
