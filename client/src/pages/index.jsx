import Main from "@/components/main";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

function index() {
  const router = useRouter();

  useEffect(() => {
    const a = async () => {
      const response = await axios.get(
        "http://localhost:3005/api/auth/is-auth",
        { withCredentials: true },
      );
      if (!response.data.message) {
        router.push('/login')
      }
    };
    a();
  }, []);

  return <Main />;
}

export default index;
