import { FaSpinner } from "react-icons/fa";

const Button = ({ text, onClick, type, disabled, icon, formType }) => {
  return (
    <>
      {type === "2" ? (
        <div className="flex items-center justify-center p-2 min-w-[20px] rounded-full bg-white hover:bg-green-300 transition duration-300 font-bold border border-green-500">
          <button onClick={onClick}>{text}</button>
        </div>
      ) : (
        <div
          className={`flex items-center justify-center p-1 min-w-[20px] rounded-full bg-green-400 hover:bg-green-300 transition duration-300 text-white font-bold `}
        >
          <button
            type={formType}
            className={`${disabled ? "cursor-not-allowed" : ""} pl-2 pr-2`}
            disabled={disabled}
            onClick={onClick}
          >
            {icon ? <FaSpinner className="animate-spin " /> : text}
          </button>
        </div>
      )}
    </>
  );
};

export default Button;
