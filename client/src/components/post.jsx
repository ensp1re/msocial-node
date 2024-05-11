import {
  FaBookmark,
  FaComment,
  FaEllipsisH,
  FaHeart,
  FaRetweet,
  FaShareAlt,
} from "react-icons/fa";
import { BsHeart, BsSave } from "react-icons/bs";
import { GoBookmark, GoBookmarkFill, GoComment } from "react-icons/go";
import Avatar from "./Avatar";
import Link from "next/link";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/router";

import "animate.css";
import moment from "moment";
import axios from "axios";
import {
  DELETE_POST_ROUTE,
  LIKE_ROUTE,
  NOTIFICATION_ROUTE,
  REPOST_ROUTE,
  SAVE_ROUTE,
} from "@/utils/ApiRoutes";
import { toast } from "react-hot-toast";
import { useStateProvider } from "@/context/StateContext";
import CommentForm from "./Form/CommenForm";
import { reducerCases } from "@/context/constants";
import { renderTextWithLineBreaks } from "@/utils/reactUtils";
import DropdownComponent from "./DropDown";
import Dropdown from "./DropDown";

const Post = ({
  id,
  text,
  imageUrl,
  createdAt,
  author,
  likes,
  reposts,
  bookmarks,
  post,
}) => {
  const router = useRouter();

  const [{ userInfo }, dispatch] = useStateProvider();
  const [user, setUser] = useState("");
  const [avatar, setAvatar] = useState("");

  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    setUser(userInfo?.id);
    setAvatar(userInfo?.profileImage);
    setLikeAmount(likes?.length);
    setRepostAmount(reposts?.length);
  }, [userInfo, likes, reposts]);

  // like

  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [likeAmount, setLikeAmount] = useState(0);

  useEffect(() => {
    const isLikedByUser = () => {
      for (let i = 0; i < likes?.length; i++) {
        const userPostLiker = likes[i]?.userId;
        if (userPostLiker === user) {
          setIsLiked(true);
          return;
        }
      }
      setIsLiked(false);
    };
    isLikedByUser();
  }, [likes, user]);

  const handleLike = () => {
    axios
      .post(LIKE_ROUTE, {
        userId: user,
        postId: id,
      })
      .then((res) => {
        if (isLiked) {
          setIsLikeLoading(true);
          console.log(res.data.message);
          toast.success(res.data.message);
          setIsLiked(false);
          setLikeAmount((prev) => prev - 1);
          handleNotify("liked your post");
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
      for (let i = 0; i < reposts?.length; i++) {
        const userPostReposter = reposts[i]?.userId;
        if (userPostReposter === user) {
          setIsReposted(true);
          return;
        }
      }
      setIsReposted(false);
    };
    isRepostedByUser();
  }, [reposts, user]);

  const handleRepost = () => {
    axios
      .post(REPOST_ROUTE, {
        userId: user,
        postId: id,
      })
      .then((res) => {
        if (isReposted) {
          setIsRepostLoading(true);
          console.log(res.data.message);
          toast.success(res.data.message);
          setIsReposted(false);
          setRepostAmount((prev) => prev - 1);
          handleNotify("reposted your post");
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
    setShowComments(!showComments);
  };

  // Bookmark

  const [isSaved, setIsSaved] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [savesAmount, setSavesAmount] = useState(0);

  useEffect(() => {
    const isSavedByUser = () => {
      for (let i = 0; i < bookmarks?.length; i++) {
        const userSaver = bookmarks[i]?.userId;
        if (userSaver === user) {
          setIsSaved(true);
          return;
        }
      }
      setIsSaved(false);
    };
    isSavedByUser();
  }, [bookmarks, user]);

  const handleSave = () => {
    axios
      .post(SAVE_ROUTE, {
        userId: user,
        postId: id,
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

  const URL_ROUTE = `/post/${id}`;

  // notify

  const handleNotify = async (text) => {
    try {
      if (author?.id !== userInfo?.id) {
        await axios
          .post(NOTIFICATION_ROUTE, {
            receiverId: author?.id,
            senderId: userInfo?.id,
            text: text,
          })
          .then((res) => console.log(res.data.data))
          .catch((err) => console.log(err));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // delete




  const handleDelete = async () => {
    try {
      await axios
        .post(DELETE_POST_ROUTE, {
          post_id: id,
        })
        .then((res) => {
          console.log(res.data.data);
          toast.success(res.data.message);
          router.reload();
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      onClick={(e) => {
        router.push(URL_ROUTE);
      }}
      className="p-3 w-full flex hover:bg-gray-50 transition duration-200 cursor-pointer"
    >
      <div className="w-[7%] m-1">
        <div className="relative w-8 h-8">
          <Avatar src={author?.avatarUrl} type={"md"} />
        </div>
      </div>
      <div className="w-[93%] flex flex-col">
        <div className="w-full p-1 flex items-center justify-between">
          <div className="flex gap-2 text-sm">
            <Link
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`/profile/${author?.username}`}
              className="font-bold hover:opacity-75 opacity-95 transition"
            >
              {author?.nickname}
            </Link>
            <Link
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`/profile/${author?.username}`}
              className="text-secondary"
            >
              @{author?.username}
            </Link>
            <span className="text-secondary">
              - {moment(createdAt).fromNow()}
            </span>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex rounded-full hover:bg-emerald-50 p-1 transition duration-300 cursor-pointer"
          >
            <Dropdown handleDelete={handleDelete} disabled={author?.id !== userInfo?.id} />
          </div>
        </div>
        <div className="flex">
          <div className="p-1">{text && renderTextWithLineBreaks(text)}</div>
        </div>
        <div className="flex h-full w-full">
          <div className="flex relative h-full w-full overflow-hidden minmax(200px, auto) rounded-3xl">
            {imageUrl && (
              <Image
                alt="image"
                src={imageUrl}
                layout="responsive"
                objectFit="contain"
                width={32}
                height={32}
              />
            )}
          </div>
        </div>
        <div className="w-full h-6 mt-4 flex flex-row justify-between pr-4">
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
                handleNotify((text = "reposted your post"));
              }}
              className={`${isRepostLoading ? "pointer-events-none" : ""} gap-2 p-1 flex items-center justify-center `}
            >
              <span className="rounded-full hover:bg-green-50 hover:scale-110 cursor-pointer">
                <FaRetweet
                  className={`${isReposted ? "text-green-500" : ""} `}
                />
              </span>
              {repostAmount !== 0 && (
                <span className="text-sm  text-secondary">{repostAmount}</span>
              )}
              <span></span>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
                handleNotify((text = "liked your post"));
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
                <span className="text-sm  text-secondary">{likeAmount}</span>
              )}
            </div>
          </div>
          <div className="flex justify-between w-[10%] p-2 gap-2">
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
                handleNotify((text = "saved your post"));
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
        {showComments && <CommentForm avatarUrl={avatar} postId={id} />}
      </div>
    </div>
  );
};

export default Post;
