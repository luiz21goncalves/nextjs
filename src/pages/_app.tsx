import GlobalStyle from "../styles/GlobalStyle";
import { Title } from "../styles/pages/Home";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle/>
      <Component {...pageProps} />
    </>
  );
}
