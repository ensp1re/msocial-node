import { reducerCases } from "./constants";

export const initialState = {
  isMoreOpen: false,
  isChatOpened: false,
  isTypeSetting: "",
  userInfo:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userInfo")) || undefined
      : undefined,
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.IS_MORE_OPEN:
      return {
        ...state,
        isMoreOpen: !state.isMoreOpen,
      };
    // case reducerCases.IS_CHAT_OPENED:
    //   const updatedIsChatOpened = !state.isChatOpened;
    //   localStorage.setItem("isChatOpened", updatedIsChatOpened);
    //   return {
    //     ...state,
    //     isChatOpened: updatedIsChatOpened,
    //   };

    case reducerCases.IS_TYPE_SETTING:
      return {
        ...state,
        isTypeSetting: action.isTypeSetting,
      };
    case reducerCases.SET_USER_INFO:
      localStorage.setItem("userInfo", JSON.stringify(action.userInfo));
      return {
        ...state,
        userInfo: action.userInfo,
      };

    // case reducerCases.SET_RELATION_INFO:
    //   localStorage.setItem("relationInfo", JSON.stringify(action.relationInfo));
    //   return {
    //     ...state,
    //     relationInfo: action.relationInfo,
    //   };

    default:
      return state;
  }
};

export default reducer;
