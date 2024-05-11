import { BiImage } from "react-icons/bi";
import { MdEmojiEmotions } from "react-icons/md";
import Avatar from "../Avatar";
import Button from "../Button";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { COMMENT_ROUTE } from "@/utils/ApiRoutes";
import { toast } from "react-hot-toast";
import axios from "axios";

const CommentForm = ({ avatarUrl, postId }) => {
  const router = useRouter();
  const [{ userInfo }] = useStateProvider();

  const currentPostImageRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const [commentImage, setCommentImage] = useState("");
  const [commentText, setCommentText] = useState("");

  const handleChangePostText = useCallback((e) => {
    setCommentText(e.target.value);
  });

  const onSubmit = async () => {
    try {
      setLoading(true);

      if (commentText) {
        let url;
        // if (postImage) {
        //   url = await handleUploadIMAGE();
        //   if (!url) {
        //     toast.error("Error while uploading an image");
        //   }
        // }

        axios
          .post(COMMENT_ROUTE, {
            postId: postId,
            userId: userInfo.id,
            text: commentText ? commentText : null,
            imageUrl: url ? url : null,
          })
          .then((res) => {
            if (res) {
              toast.success("Replied");
              console.log(res.data.data);
              setLoading(false);
              setCommentText("");
              setCommentImage("");
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error("Something went wrong!");
            setLoading(false);
          });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      id={postId}
      className={`flex w-full p-3 border-b border-b-gray-200 flex-row`}
    >
      <div className="">
        <Avatar src={avatarUrl} type={"sm"} />
      </div>
      <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full relative p-1 border-b border-b-gray-200 mb-2">
          <textarea
            {...register("text")}
            className="block whitespace-pre  text-gray-800 w-full min-h-14 outline-none rounded-md bg-transparent border-transparent focus:bg-white disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed resize-none"
            rows="1"
            value={commentText}
            id="comment-textarea"
            placeholder="What's new?"
            onChange={(event) => {
              handleChangePostText(event);
              event.target.style.height = "auto";
              event.target.style.height = event.target.scrollHeight + "px";
            }}
          />
        </div>
        <div className="w-full flex">
          <div className="w-[80%] border-r border-r-gray-300 flex flex-row justify-start items-center gap-3">
            <div className="p-1 text-xl rounded-full hover:bg-green-100 transition duration-200 cursor-not-allowed">
              <BiImage className="text-green-500" disabled />
            </div>
            <div className="p-1 text-xl rounded-full hover:bg-green-100 transition duration-200 cursor-not-allowed">
              <MdEmojiEmotions className="text-green-500" disabled />
            </div>
          </div>
          <div className="w-[20%] flex items-center justify-center">
            <Button
              formType={"submit"}
              icon={loading}
              disabled={loading || !commentText}
              text={"Reply"}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
