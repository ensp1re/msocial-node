import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { REGISTER_ROUTE } from "@/utils/ApiRoutes";
import app from "@/utils/FirebaseConfig";
import axios from "axios";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillGoogleCircle } from "react-icons/ai";
import { FaGoogle, FaSpinner } from "react-icons/fa";

const LoginContainer = () => {
  const router = useRouter();

  const currentAvatarRef = useRef(null);
  const [downloadURL, setDownloadURL] = useState(null);
  const [changingAvatar, setChangingAvatar] = useState(null);
  const [errorReg, setErrorReg] = useState("");
  const [loading, setLoading] = useState(false);

  const [{userInfo}, dispatch] = useStateProvider();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm();

  useEffect(() => {
    if (changingAvatar && currentAvatarRef.current) {
      currentAvatarRef.current.src = URL.createObjectURL(changingAvatar);
    }
  }, [changingAvatar, currentAvatarRef]);

  const handleChangeImage = (e) => {
    setChangingAvatar(e.target.files[0]);
  };

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

      const { password, confirmPassword } = data;

      if (password !== confirmPassword) {
        setError("confirmPassword", {
          type: "validate",
          message: "Passwords don't match",
        });
        setLoading(false);
        return;
      }

      let url;
      if (changingAvatar) {
        url = await handleUploadIMAGE();
      } else {
        url = "/default_avatar.png";
      }

      if (url) {
        data.avatar = url;
        axios
          .post(REGISTER_ROUTE, data, {
            withCredentials: true,
          })
          .then((response) => {
            if (response) {
              const {
                id,
                username,
                nickname,
                avatarUrl: profileImage,
                email,
                bio,
              } = response.data.data;

              dispatch({
                type: reducerCases.SET_USER_INFO,
                userInfo: {
                  id,
                  username,
                  nickname,
                  profileImage,
                  email,
                  bio,
                },
              });
              console.log(response.data.message);
            }
            router.push("/");
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.message
            ) {
              setErrorReg(error.response.data.message);
            } else {
              setErrorReg("An error occurred");
            }
            console.log(error);
          })
          .finally(() => {
            setLoading(false);
            console.log("Login request completed");
          });
      }
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
    <div className="w-full max-w-md mx-auto mt-1 flex flex-col items-center">
      <div className=" mb-2 flex items-center justify-center rounded-full ">
        <span className="text-xl p-1 font-semibold text-center text-gray-500">
          Register
        </span>
      </div>
      {/* <div className="w-full px-3 mb-4 rounded-sm border border-gray-200 flex items-center justify-center hover:bg-green-50 cursor-pointer duration-200">
        <div className="flex px-5 items-center gap-2 p-2 ">
          <span>
            <FaGoogle />
          </span>
          <span>Login</span>
        </div>
      </div> */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="w-full flex items-center mb-4 gap-2 ">
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
          <div className="relative top-5 w-[50px] h-[50px]">
            {currentAvatarRef && changingAvatar ? (
              <Image
                ref={currentAvatarRef}
                alt="Avatar"
                className="rounded-full"
                width="45"
                height="45"
                objectFit="contain"
                src={""}
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
            htmlFor="email"
          >
            E-mail
          </label>
          <input
            {...register("email", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            name="email"
            //   value={formData.username}
            //   onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">
              This field is required
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            {...register("username", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            name="username"
            //   value={formData.username}
            //   onChange={handleChange}
          />
          {errors.username && (
            <p className="text-red-500 text-xs italic">
              This field is required
            </p>
          )}
        </div>
        <div className="mb-2">
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
          {errors.nickname && (
            <p className="text-red-500 text-xs italic">
              {errors.nickname.message}
            </p>
          )}
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
              pattern: {
                value: /^[a-zA-Z0-9@^%$#*()_}]*$/,
                message: "Password can only contain letters and numbers",
              },
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            name="password"
            //   value={formData.nickname}
            //   onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm password
          </label>
          <input
            {...register("confirmPassword", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
              pattern: {
                value: /^[a-zA-Z0-9@^%$#**()_}]*$/,
                message: "Password can only contain letters and numbers",
              },
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            //   value={formData.nickname}
            //   onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs italic">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="w-full flex gap-1 text-sm text-gray-500 mb-4">
          <span>If you have an account -</span>
          <Link href={"/login"} className="text-green-500 hover:underline ">
            login
          </Link>
        </div>
        <div className="w-full flex justify-center items-center">
          <button
            disabled={loading}
            className={`text-sm text-center
            ${loading ? "disabled:cursor-not-allowed" : ""}
             bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200`}
            type="submit"
          >
            {loading ? (
              <span className="text-lg">
                <FaSpinner className="animate-spin" />
              </span>
            ) : (
              <span>Register</span>
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

export default LoginContainer;
