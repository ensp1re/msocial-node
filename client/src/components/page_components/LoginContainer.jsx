import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaSpinner } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { LOGIN_ROUTE } from "@/utils/ApiRoutes";

const LoginContainer = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorPost, setErrorPost] = useState("");

  const [{}, dispatch] = useStateProvider();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      axios
        .post(LOGIN_ROUTE, data, {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
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
          setErrorPost(error.response?.data?.message || "Something went wrong");
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
          console.log("Login request completed");
        });
    } catch (error) {
      setError("password", {
        type: "manual",
        message: error.response.data.message || "An error occurred",
      });
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="mb-4 flex items-center justify-center rounded-full">
        <span className="text-xl p-1 font-semibold text-center text-gray-500">
          Login
        </span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            E-mail or Username
          </label>
          <input
            {...register("email", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            placeholder="Username"
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
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="w-full flex gap-1 text-sm text-gray-500 mb-4">
          <span>If you don't have an account -</span>
          <Link href={"/register"} className="text-green-500 hover:underline">
            register
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
              <span>Login</span>
            )}
          </button>
        </div>
        {errorPost && (
          <p className="text-red-500 text-xs italic">{errorPost}</p>
        )}
      </form>
    </div>
  );
};

export default LoginContainer;
