import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useStateProvider } from "@/context/StateContext";
import { FaArrowLeft } from "react-icons/fa";
import { reducerCases } from "@/context/constants";
import AccountInfoForm from "../Form/AccountUpdate";
import ChangePasswordForm from "../Form/ChangePasswordForm";

const Setting = () => {
  const [{ isTypeSetting }] = useStateProvider();

  return (
    <div className="w-full flex justify-center items-center overflow-hidden">
      {isTypeSetting === "accountInfo" && <AccountInfoForm />}
      {isTypeSetting === "changePassword" && <ChangePasswordForm />}
      {!isTypeSetting && (
        <span className="text-xl text-gray-500">Select a setting</span>
      )}
    </div>
  );
};

export default Setting;
