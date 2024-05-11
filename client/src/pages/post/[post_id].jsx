import Base from "@/components/base";
import PostSide from "@/components/page_components/PostLeftSide";
import PostCommentSide from "@/components/page_components/PostRightSide";
import RightSide from "@/components/page_components/rightSide";
import { useStateProvider } from "@/context/StateContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { GET_POST_ROUTE } from "@/utils/ApiRoutes";
import { FaSpinner } from "react-icons/fa";

const PostPage = () => {
  const router = useRouter();

  const [{ userInfo }] = useStateProvider();

  const { post_id } = router.query;
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getPost = async () => {
      try {
        await axios
          .get(GET_POST_ROUTE, {
            params: {
              post_id: post_id,
            },
          })
          .then((res) => {
            if (res) {
              console.log(res.data.data);
              setPost(res.data.data);
              setUser(userInfo);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(err);
      }
    };
    getPost();
  }, [post_id]);

  return (
    <Base>
      <div className="w-full h-screen flex flex-row">
        <div
          className={`w-full flex border-r border-r-gray-200 ${post ? "" : "justify-center items-center"}`}
        >
          {post ? (
            <div className="w-full flex flex-col">
              <PostSide post={post} user={user} />
              <PostCommentSide post={post} user={user} />
            </div>
          ) : (
            <FaSpinner className="text-lg text-gray-600 animate-spin" />
          )}
        </div>
        <div className="w-full hidden md:flex lg:flex ">
          <RightSide search={true} />
        </div>
      </div>
    </Base>
  );
};

export default PostPage;
