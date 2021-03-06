import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store";
import "../styles/styles.scss";
import Head from "next/head";
import React from "react"

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Sistema de proyección</title>
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
export default App;
