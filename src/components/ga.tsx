import Head from "next/head";

function GA() {
  return (
    <Head>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=G-QVDL7L6CR7`}
      ></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-QVDL7L6CR7');
        `}
      </script>
    </Head>
  );
}

export default GA;
