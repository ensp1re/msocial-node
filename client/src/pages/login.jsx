import LoginContainer from "@/components/page_components/LoginContainer";
import { checkAuth } from "@/utils/auth";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaSpinner, FaTruckLoading } from "react-icons/fa";

function login() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const a = async () => {
      const response = await axios.get(
        "http://localhost:3005/api/auth/is-auth",
        { withCredentials: true },
      );
      if (response.data.message) {
        setIsAuthed(true);
        router.push("/");
        setIsAuthed(false);
      }
    };
    a();
  }, []);

  return (
    <div className="w-full h-screen flex flex-row">
      <div className="w-full flex-1 bg-green-500 border-r border-r-gray-200 hidden sm:flex md:flex lg:flex justify-center items-center">
        <div className="relative">
          <span className="text-2xl text-white font-semibold">MSocial</span>
        </div>
      </div>
      <div className="w-full flex-1 flex justify-center items-center">
        {isAuthed ? (
          <div className="flex flex-col justify-center items-center gap-2">
            <span className="text-lg">
              <FaSpinner className="animate animate-spin" />
            </span>
            <span className="text-sm font-semibold">
              Please wait for redirecting...
            </span>
          </div>
        ) : (
          <LoginContainer />
        )}
      </div>
    </div>
  );
}

export default login;
