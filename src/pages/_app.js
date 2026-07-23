import "@/styles/globals.css";
import PreviewBadge from "../components/PreviewBadge";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <PreviewBadge />
    </>
  );
}
