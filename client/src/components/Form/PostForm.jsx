import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "../Button";
import { useForm } from "react-hook-form";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import toast from "react-hot-toast";
import axios from "axios";
import { POST_ROUTE } from "@/utils/ApiRoutes";
import { useStateProvider } from "@/context/StateContext";
import { useRouter } from "next/router";
import app from "@/utils/FirebaseConfig";


const { BiImage } = require("react-icons/bi");
const { MdEmojiEmotions, MdClose } = require("react-icons/md");

const PostForm = () => {
  const router = useRouter();
  const [{ userInfo }] = useStateProvider();

  const currentPostImageRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const [postImage, setPostImage] = useState("");
  const [postText, setPostText] = useState("");

  const handleUploadIMAGE = async () => {
    if (!postImage) return;

    const file = postImage;
    const storage = getStorage(app);

    const storageRef = ref(storage, "files/" + file.name);
    await uploadBytes(storageRef, file);
    console.log("File uploaded successfully");

    const url = await getDownloadURL(storageRef);
    console.log("File URL:", url);
    setDownloadURL(url);
    return url; // Возвращаем URL для использования в onSubmit
  };

  const handleChangePostText = useCallback((e) => {
    setPostText(e.target.value);
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  useEffect(() => {
    if (postImage && currentPostImageRef.current) {
      currentPostImageRef.current.src = URL.createObjectURL(postImage);
    }
  }, [postImage, currentPostImageRef]);

  const handleChangePostImage = useCallback((e) => {
    setPostImage(e.target.files[0]);
  }, []);
  const handleClick = () => {
    const imageInput = document.getElementById("post-image");
    imageInput.click();
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (postImage || postText) {
        let url;
        if (postImage) {
          url = await handleUploadIMAGE();
          if (!url) {
            toast.error("Error while uploading an image");
          }
        }

        axios
          .post(POST_ROUTE, {
            userId: userInfo.id,
            text: postText ? postText : null,
            imageUrl: url ? url : null,
          })
          .then((res) => {
            if (res) {
                toast.success("Posted")
              console.log(res.data.message);
              router.reload();
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col">
      <div className="w-full relative p-1 border-b border-b-gray-200 mb-2">
        <textarea
          {...register("text")}
          className="block  text-gray-800 w-full min-h-14 outline-none rounded-md bg-transparent border-transparent focus:bg-white disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed resize-none"
          rows="1"
          value={postText}
          placeholder="What's new?"
          onChange={(event) => {
            handleChangePostText(event);
            event.target.style.height = "auto";
            event.target.style.height = event.target.scrollHeight + "px";
          }}
        />
      </div>
      {currentPostImageRef && postImage ? (
        <div className="flex h-full w-full mb-2">
          <div className="flex relative h-full w-full overflow-hidden minmax(200px, auto) rounded-3xl">
            <div
              onClick={() => {
                setPostImage(null);
              }}
              className="absolute top-3 right-4 p-1 rounded-full hover:bg-green-50 cursor-pointer transition duration-200 hover:scale-110"
            >
              <MdClose className="text-lg text-green-500" />
            </div>
            <Image
              alt="image"
              ref={currentPostImageRef}
              layout="responsive"
              objectFit="contain"
              width={32}
              height={32}
            />
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="w-full flex">
        <div className="w-[80%] border-r border-r-gray-300 flex flex-row justify-start items-center gap-3">
          <input
            onChange={(e) => {
              handleChangePostImage(e);
            }}
            id="post-image"
            type="file"
            hidden
          />
          <div className="p-1 text-xl rounded-full hover:bg-green-100 transition duration-200 cursor-pointer">
            <BiImage onClick={handleClick} className="text-green-500" />
          </div>
          <div className="p-1 text-xl rounded-full hover:bg-green-100 transition duration-200 cursor-pointer">
            <MdEmojiEmotions className="text-green-500" />
          </div>
        </div>
        <div className="w-[20%] flex items-center justify-center">
          <Button
            formType={"submit"}
            icon={loading}
            disabled={loading || (!postText && !postImage)}
            text={"Post"}
          />
        </div>
      </div>
    </form>
  );
};

export default PostForm;
