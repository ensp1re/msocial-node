import Base from "@/components/base";
import Profile from "@/components/page_components/profile";
import RightSide from "@/components/page_components/rightSide";
import {
  CHECK_USER_ROUTE,
  FIND_USER_ROUTE,
  GET_POST_ROUTE,
  GET_USER_POST_ROUTE,
} from "@/utils/ApiRoutes";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const ProfilePage = () => {
  const router = useRouter();
  const { username } = router.query;

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState(null);
  const [user, setUser] = useState(null);
  const [isUserExists, setIsUserExists] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      if (username && !posts) {
        setLoading(true);
        await axios
          .get(GET_USER_POST_ROUTE, {
            params: { username: username },
          })
          .then((res) => {
            setPosts(res.data.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          })
          .finally(() => setLoading(false));
      }
    };
    getPosts();
  }, [username, posts]);

  useEffect(() => {
    const getUser = async () => {
      if (username && !user) {
        setLoading(true);
        await axios
          .get(FIND_USER_ROUTE, {
            params: { username: username },
          })
          .then((res) => {
            setUser(res.data.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          })
          .finally(() => setLoading(false));
      }
    };
    getUser();
  }, [username, user]);

  useEffect(() => {
    const checkUser = async () => {
      if (username) {
        setLoading(true);
        await axios
          .get(CHECK_USER_ROUTE, {
            params: { username: username },
          })
          .then((res) => {
            setIsUserExists(res.data.message);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          })
          .finally(() => setLoading(false));
      }
    };
    checkUser();
  }, [username]);

  return (
    <Base>
      <div className="w-full h-screen flex flex-row">
        <div
          className={`${!isUserExists ? "items-center justify-center" : ""} w-full flex border-r border-r-gray-200`}
        >
          {isUserExists && (
            <Profile user={user} posts={posts} loading={loading} />
          )}
          {!isUserExists && !loading ? (
            <span className="text-lg text-gray-600">No user found</span>
          ) : (
            ""
          )}
          {loading && (
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

export default ProfilePage;
