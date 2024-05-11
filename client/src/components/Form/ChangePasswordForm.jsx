import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { FaArrowLeft } from "react-icons/fa";

const ChangePasswordForm = () => {
  const [{ isTypeSetting }, dispatch] = useStateProvider();

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
        //   onSubmit={handleSubmit}
        className="w-full flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Current password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            name="username"
            //   value={formData.username}
            //   onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="nickname"
          >
            New password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="nickname"
            type="text"
            placeholder="Nickname"
            name="nickname"
            //   value={formData.nickname}
            //   onChange={handleChange}
          />
        </div>
        <div className="w-full flex justify-center items-center">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
