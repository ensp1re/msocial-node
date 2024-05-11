import { StateProvider } from "@/context/StateContext";
import reducer, { initialState } from "@/context/StateReducers";
import "@/styles/globals.css";
import Head from "next/head";
import { Poppins } from "next/font/google";
import Container from "@/components/container";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { CHECK_AUTH_ROUTE } from "@/utils/ApiRoutes";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    try {
      const checkAuth = async () => {
        const response = await axios.get(CHECK_AUTH_ROUTE, {
          withCredentials: true,
        });
        if (!response.data.message) return router.push("/login");
      };
      checkAuth();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Container>
        <Head>
          <title>MSocial</title>
          <link rel="shortcut icon" href="/logo.png" />
        </Head>
        <div className={`${poppins.className}`}>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "green",
                color: "rgb(255,255,255)",
              },
            }}
          />
          <Component {...pageProps} />
        </div>
      </Container>
    </StateProvider>
  );
}
