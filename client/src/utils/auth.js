import axios from "axios";

export const loginUser = async (email, password) => {
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  try {
    await axios
      .get("http://localhost:3005/api/auth/logout", { withCredentials: true })
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        router.push("/login");
      });
  } catch (error) {
    console.log(error);
  }
};

export const checkAuth = async () => {
  try {
    const response = await axios.get("http://localhost:3005/api/auth/is-auth", {
      withCredentials: true,
    });
    return response.data.message;
  } catch (error) {
    console.log(error);
  }
};
