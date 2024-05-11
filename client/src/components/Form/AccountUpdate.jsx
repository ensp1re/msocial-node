import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { useForm } from "react-hook-form";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { UPDATE_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { toast } from "react-hot-toast";
import app from "@/utils/FirebaseConfig";

const AccountInfoForm = () => {
  const currentAvatarRef = useRef(null);

  const [{ userInfo }, dispatch] = useStateProvider();

  const [downloadURL, setDownloadURL] = useState(null);
  const [errorReg, setErrorReg] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userInfo) {
      setUser(userInfo?.id);
    }
  }, [userInfo]);

  const [changingAvatar, setChangingAvatar] = useState("");

  useEffect(() => {
    if (changingAvatar && currentAvatarRef.current) {
      currentAvatarRef.current.src = URL.createObjectURL(changingAvatar);
    }
  }, [changingAvatar, currentAvatarRef]);

  const handleChangeImage = (e) => {
    setChangingAvatar(e.target.files[0]);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const handleUploadIMAGE = async () => {
    if (!changingAvatar) return;

    const file = changingAvatar;
    const storage = getStorage(app);

    const storageRef = ref(storage, "files/" + file.name);
    await uploadBytes(storageRef, file);
    console.log("File uploaded successfully");

    const url = await getDownloadURL(storageRef);
    console.log("File URL:", url);
    setDownloadURL(url);
    return url; // Возвращаем URL для использования в onSubmit
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const { username, nickname, bio } = data;

      data.userId = user;

      let url;
      if (changingAvatar) {
        url = await handleUploadIMAGE();
      }

      data.avatar = url || null;
      axios
        .post(UPDATE_USER_ROUTE, data)
        .then((response) => {
          if (response) {
            const {
              username,
              nickname,
              avatarUrl: profileImage,
              bio,
            } = response.data.data;

            const updatedUserInfo = {
              ...userInfo,
              username,
              nickname,
              profileImage,
              bio,
            };

            dispatch({
              type: reducerCases.SET_USER_INFO,
              userInfo: updatedUserInfo,
            });
            console.log(response.data.message);
            toast.success(response.data.message);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            setErrorReg(error.response.data.message);
            toast.error(error.response.data.message);
            setLoading(false);
          } else {
            setErrorReg("An error occurred");
            toast.error("An error occurred");
            setLoading(false);
          }
          console.log(error);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      setError("password", {
        type: "manual",
        message: error.response
          ? error.response.data.message || "An error occurred"
          : "An error occurred",
      });
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div
        onClick={() => {
          dispatch({
            type: reducerCases.IS_TYPE_SETTING,
            isTypeSetting: "",
          });
        }}
        className=" mb-4 flex items-center justify-center rounded-full hover:bg-green-50 transition duration-200 cursor-pointer hover:scale-110"
      >
        <span className="text-xl p-1 text-center">
          <FaArrowLeft />
        </span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="w-full flex items-center mb-4 gap-2">
          <div className="">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="logo"
            >
              Avatar
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="logo"
              type="file"
              name="logo"
              onChange={(e) => {
                handleChangeImage(e);
              }}
              accept="image/*"
            />
          </div>
          <div className="relative top-4">
            {currentAvatarRef && changingAvatar ? (
              <Image
                ref={currentAvatarRef}
                alt="Avatar"
                className="rounded-full"
                width="45"
                height="45"
                objectFit="contain"
              />
            ) : (
              <Image
                src={"/default_avatar.png"}
                alt="Avatar"
                className="rounded-full"
                width="45"
                height="45"
                objectFit="contain"
              />
            )}
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            {...register("username", { required: false })}
            placeholder="Username"
            name="username"
            //   value={formData.username}
            //   onChange={handleChange}
          />
        </div>
        {errors.username && (
          <p className="text-red-500 text-xs italic">This field is required</p>
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="nickname"
          >
            Nickname
          </label>
          <input
            {...register("nickname", { required: false })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="nickname"
            type="text"
            placeholder="Nickname"
            name="nickname"
            //   value={formData.nickname}
            //   onChange={handleChange}
          />
        </div>
        {errors.nickname && (
          <p className="text-red-500 text-xs italic">
            {errors.nickname.message}
          </p>
        )}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="bio"
          >
            Bio
          </label>
          <textarea
            {...register("bio", { required: false })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="bio"
            placeholder="Bio"
            name="bio"
            //   value={formData.bio}
            //   onChange={handleChange}
          />
        </div>
        {errors.bio && (
          <p className="text-red-500 text-xs italic">{errors.bio.message}</p>
        )}
        <div className="w-full flex justify-center items-center">
          <button
            disabled={loading}
            className={`${loading ? "disabled:cursor-not-allowed" : ""}
            bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200`}
            type="submit"
          >
            {loading ? (
              <span className="text-lg">
                <FaSpinner className="animate-spin" />
              </span>
            ) : (
              <span>Save</span>
            )}
          </button>
        </div>
        <div className="w-full overflow-x-auto h-10 custom-scrollbar">
          {errorReg && (
            <p className="text-[10px] text-red-500 italic">{errorReg}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AccountInfoForm;
