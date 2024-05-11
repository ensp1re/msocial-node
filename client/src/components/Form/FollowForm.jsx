import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../Button";
import axios from "axios";

import {
  CHECK_FOLLOWING_ROUTE,
  FOLLOW_ROUTE,
  UNFOLLOW_ROUTE,
} from "@/utils/ApiRoutes";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

const FollowForm = ({ followerId, followingId }) => {
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollowing = async () => {
      try {
        const res = await axios.post(CHECK_FOLLOWING_ROUTE, {
          followerId,
          followingId,
        });
        console.log(res.data.message);
        setIsFollowing(res.data.message);
      } catch (err) {
        console.log(err);
      }
    };
    checkFollowing();
  }, [followerId, followingId]);

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitFollow = async () => {
    try {
      setLoading(true);
      axios
        .post(FOLLOW_ROUTE, {
          followerId,
          followingId,
        })
        .then((res) => {
          console.log(res.data.message);
          toast.success(res.data.message);
          setIsFollowing(true);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.data.message);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitUnFollow = async () => {
    try {
      setLoading(true);
      axios
        .post(UNFOLLOW_ROUTE, {
          followerId,
          followingId,
        })
        .then((res) => {
          console.log(res.data.message);
          toast.success(res.data.message);
          setIsFollowing(false);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isFollowing ? (
        <form onSubmit={handleSubmit(onSubmitUnFollow)}>
          <div
            className={`flex items-center justify-center p-1 min-w-[20px] rounded-full border border-green-300 bg-white hover:bg-green-300 transition duration-300 text-green-500 font-bold `}
          >
            <button
              type="submit"
              className={`${loading ? "cursor-not-allowed" : ""} pl-2 pr-2`}
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin " /> : "Unfollow"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit(onSubmitFollow)}>
          <div
            className={`flex items-center justify-center p-1 min-w-[20px] rounded-full bg-green-400 hover:bg-green-300 transition duration-300 text-white font-bold `}
          >
            <button
              type="submit"
              className={`${loading ? "cursor-not-allowed" : ""} pl-2 pr-2`}
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin " /> : "Follow"}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default FollowForm;
