export const HOST = "http://localhost:3005";

const AUTH_ROUTE = `${HOST}/api/auth`;
const ACTION_ROUTE = `${HOST}/api/action`;
const MESSAGE_ROUTE = `${HOST}/api/message`;

export const CHECK_AUTH_ROUTE = `${AUTH_ROUTE}/is-auth`;
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`;
export const REGISTER_ROUTE = `${AUTH_ROUTE}/register`;
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const UPDATE_USER_ROUTE = `${AUTH_ROUTE}/update-user`;

export const POST_ROUTE = `${ACTION_ROUTE}/post`;
export const GET_ALL_POSTS = `${ACTION_ROUTE}/get-posts`;
export const LIKE_ROUTE = `${ACTION_ROUTE}/like`;
export const REPOST_ROUTE = `${ACTION_ROUTE}/repost`;
export const SAVE_ROUTE = `${ACTION_ROUTE}/save`;
export const COMMENT_ROUTE = `${ACTION_ROUTE}/comment`;
export const GET_POST_ROUTE = `${ACTION_ROUTE}/get-post-by-id`;
export const GET_USER_POST_ROUTE = `${ACTION_ROUTE}/get-posts-by-username`;
export const FIND_USERS_ROUTE = `${ACTION_ROUTE}/get-users-by-keyword`;
export const FIND_USER_ROUTE = `${ACTION_ROUTE}/get-user-by-username`;
export const CHECK_USER_ROUTE = `${ACTION_ROUTE}/check-user`;
export const FOLLOW_ROUTE = `${ACTION_ROUTE}/follow`;
export const UNFOLLOW_ROUTE = `${ACTION_ROUTE}/unfollow`;
export const CHECK_FOLLOWING_ROUTE = `${ACTION_ROUTE}/check-following`;
export const GET_NOTIFICATION_ROUTE = `${ACTION_ROUTE}/get-all-notifications`;
export const NOTIFICATION_ROUTE = `${ACTION_ROUTE}/create-notification`;
export const DELETE_POST_ROUTE = `${ACTION_ROUTE}/delete`;

export const RELATION_ROUTE = `${MESSAGE_ROUTE}/create-relation`;
export const GET_RELATION_ROUTE = `${MESSAGE_ROUTE}/get-relation`;
export const ALL_RELATIONS_ROUTE = `${MESSAGE_ROUTE}/get-all-relations`;
export const SEND_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/send-message`;
