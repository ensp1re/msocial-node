import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsHeart } from "react-icons/bs";
import {
  FaArrowLeft,
  FaEllipsisH,
  FaHeart,
  FaRetweet,
  FaShareAlt,
} from "react-icons/fa";
import { GoBookmark, GoBookmarkFill, GoComment } from "react-icons/go";
import { MdAddCircleOutline, MdArrowLeft } from "react-icons/md";
import Avatar from "../Avatar";
import { useEffect, useState } from "react";
import Button from "../Button";
import moment from "moment";
import { renderTextWithLineBreaks } from "@/utils/reactUtils";
import axios from "axios";
import { LIKE_ROUTE, REPOST_ROUTE, SAVE_ROUTE } from "@/utils/ApiRoutes";
import { toast } from "react-hot-toast";

const PostSide = ({ post, user }) => {
  const router = useRouter();

  useEffect(() => {
    setLikeAmount(post?.likes.length);
    setRepostAmount(post?.reposts.length);
  }, [post?.likes, post?.reposts]);

  // like

  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [likeAmount, setLikeAmount] = useState(0);

  useEffect(() => {
    const isLikedByUser = () => {
      for (let i = 0; i < post?.likes.length; i++) {
        const userPostLiker = post?.likes[i].userId;
        if (userPostLiker === user?.id) {
          setIsLiked(true);
          return;
        }
      }
      setIsLiked(false);
    };
    isLikedByUser();
  }, [post?.likes, user]);

  const handleLike = () => {
    axios
      .post(LIKE_ROUTE, {
        userId: user?.id,
        postId: post?.id,
      })
      .then((res) => {
        if (isLiked) {
          setIsLikeLoading(true);
          console.log(res.data.message);
          toast.success(res.data.message);
          setIsLiked(false);
          setLikeAmount((prev) => prev - 1);
        } else {
          setIsLikeLoading(true);
          setIsLiked(true);
          console.log(res.data.message);
          toast.success(res.data.message);
          setLikeAmount((prev) => prev + 1);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      })
      .finally(() => {
        setIsLikeLoading(false);
      });
  };

  // repost

  const [isReposted, setIsReposted] = useState(false);
  const [isRepostLoading, setIsRepostLoading] = useState(false);
  const [repostAmount, setRepostAmount] = useState(0);

  useEffect(() => {
    const isRepostedByUser = () => {
      for (let i = 0; i < post?.reposts.length; i++) {
        const userPostReposter = post?.reposts[i].userId;
        if (userPostReposter === user?.id) {
          setIsReposted(true);
          return;
        }
      }
      setIsReposted(false);
    };
    isRepostedByUser();
  }, [post?.reposts, user]);

  const handleRepost = () => {
    axios
      .post(REPOST_ROUTE, {
        userId: user?.id,
        postId: post?.id,
      })
      .then((res) => {
        if (isReposted) {
          setIsRepostLoading(true);
          console.log(res.data.message);
          toast.success(res.data.message);
          setIsReposted(false);
          setRepostAmount((prev) => prev - 1);
        } else {
          setIsRepostLoading(true);
          setIsReposted(true);
          console.log(res.data.message);
          toast.success(res.data.message);
          setRepostAmount((prev) => prev + 1);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      })
      .finally(() => {
        setIsRepostLoading(false);
      });
  };

  // comment

  const handleCommentIconClick = () => {
    const textarea = document.getElementById("comment-textarea");

    if (textarea) {
      textarea.focus();
    }
  };

  // Bookmark

  const [isSaved, setIsSaved] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  useEffect(() => {
    const isSavedByUser = () => {
      for (let i = 0; i < post?.bookmarks.length; i++) {
        const userSaver = post?.bookmarks[i].userId;
        if (userSaver === user?.id) {
          setIsSaved(true);
          return;
        }
      }
      setIsSaved(false);
    };
    isSavedByUser();
  }, [post?.bookmarks, user]);

  const handleSave = () => {
    axios
      .post(SAVE_ROUTE, {
        userId: user?.id,
        postId: post?.id,
      })
      .then((res) => {
        if (isSaved) {
          setIsSaveLoading(true);
          console.log(res.data.message);
          toast.success(res.data.message);
          setIsSaved(false);
          setSavesAmount((prev) => prev - 1);
        } else {
          setIsSaveLoading(true);
          setIsSaved(true);
          console.log(res.data.message);
          toast.success(res.data.message);
          setSavesAmount((prev) => prev + 1);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      })
      .finally(() => {
        setIsSaveLoading(false);
      });
  };

  return (
    <div className="w-full">
      <div className="w-full sticky top-0 z-50 flex justify-between items-center p-2 border-b border-b-gray-200 bg-white bg-opacity-95">
        <div className="flex justify-center items-center gap-3">
          <div
            onClick={() => {
              router.back();
            }}
            className="rounded-full hover:bg-green-50 transition duration-200 cursor-pointer hover:scale-110"
          >
            <FaArrowLeft className="text-2xl p-1" />
          </div>
          <span className="text-gray-800 font-semibold text-lg">Post</span>
        </div>
      </div>
      <div className="w-full">
        <div className=" p-3 w-full flex hover:bg-gray-50 transition duration-200 cursor-pointer">
          <div className="w-[7%] m-1">
            <Avatar src={post?.user?.avatarUrl} type={"sm"} />
          </div>
          <div className="w-[93%] flex flex-col">
            <div className="p-1 flex items-center justify-between">
              <div className="flex gap-2 text-sm">
                <Link
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  href={`/profile/${post?.user?.username}`}
                  className="font-bold hover:opacity-75 opacity-95 transition"
                >
                  {post?.user?.nickname}
                </Link>
                <Link
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  href={`/profile/${post?.user?.username}`}
                  className="text-secondary"
                >
                  @{post?.user?.username}
                </Link>
                <span className="text-secondary">
                  - {moment(post?.createdAt).fromNow()}
                </span>
              </div>
              <div className="flex justify-center items-center gap-2">
                {user?.id !== post?.userId && (
                  <div>
                    <Button text={"Follow"} />
                  </div>
                )}
                <div className="flex rounded-full hover:bg-emerald-50 p-1 transition duration-300 cursor-pointer">
                  <FaEllipsisH />
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="p-1">
                {post?.text && renderTextWithLineBreaks(post?.text)}
              </div>
            </div>
            <div className="flex h-full w-full">
              <div className="flex relative h-full w-full overflow-hidden minmax(200px, auto) rounded-3xl">
                {post?.imageUrl && (
                  <Image
                    alt="image"
                    src={post?.imageUrl}
                    layout="responsive"
                    objectFit="contain"
                    width={32}
                    height={32}
                  />
                )}
              </div>
            </div>
            <div className="w-full flex flex-row justify-between pr-4">
              <div className="flex justify-between w-[90%] pr-5 gap-2">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCommentIconClick();
                  }}
                  className="rounded-full p-1 flex items-center justify-center hover:bg-green-50 hover:scale-110 cursor-pointer"
                >
                  <GoComment className=" text-" />
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRepost();
                  }}
                  className={`${isRepostLoading ? "pointer-events-none" : ""} gap-2 p-1 flex items-center justify-center `}
                >
                  <span className="rounded-full hover:bg-green-50 hover:scale-110 cursor-pointer">
                    <FaRetweet
                      className={`${isReposted ? "text-green-500" : ""} `}
                    />
                  </span>
                  {repostAmount !== 0 && (
                    <span className="text-sm  text-secondary">
                      {repostAmount}
                    </span>
                  )}
                  <span></span>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike();
                  }}
                  className={`${isLikeLoading ? "pointer-events-none" : ""} gap-2 flex items-center justify-center `}
                >
                  <span className="rounded-full p-1  hover:bg-green-50 hover:scale-110 cursor-pointer ">
                    {isLiked ? (
                      <FaHeart className="text-green-600 " />
                    ) : (
                      <BsHeart className="" />
                    )}
                  </span>
                  {likeAmount !== 0 && (
                    <span className="text-sm  text-secondary">
                      {likeAmount}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between w-[10%] p-2 gap-2">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                  }}
                  className={`${isSaveLoading ? "pointer-events-none" : ""} flex items-center justify-center`}
                >
                  <span className="rounded-full p-1  hover:bg-green-50 hover:scale-110 cursor-pointer">
                    {isSaved ? (
                      <GoBookmarkFill className="rounded-full text-lg text-green-500 hover:bg-green-50 hover:scale-110 cursor-pointer" />
                    ) : (
                      <GoBookmark className="text-lg rounded-full hover:bg-green-50 hover:scale-110 cursor-pointer" />
                    )}
                  </span>
                </div>
                <div className="rounded-full p-1 flex items-center justify-center hover:bg-green-50 hover:scale-110 cursor-pointer">
                  <FaShareAlt />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSide;
