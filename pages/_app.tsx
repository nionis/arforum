import React from "react";
import { observer } from "mobx-react";
import App from "next/app";
import Head from "next/head";
import dynamic from "next/dynamic";

const Router = dynamic(() => import("src/components/Router"), {
  ssr: false
});

@observer
class MyApp extends App {
  public render() {
    const { pageProps } = this.props;

    return (
      <div>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto&display=swap"
            rel="stylesheet"
            key="google-font-cabin"
          />
        </Head>

        {/* <Header /> */}
        <Router {...pageProps} />

        <style global jsx>{`
          body {
            margin: 0;
            padding: 0;
            font-family: "Roboto", sans-serif;
          }
        `}</style>
      </div>
    );
  }
}

export default MyApp;
