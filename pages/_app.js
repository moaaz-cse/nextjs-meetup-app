//this act as root component nextJs will render
import "../styles/globals.css";
import Layout from "../components/layout/Layout";

//Component is a prop that hold the actual page content that should be rendered
("MEANS-component will be different whenever page content changes.");
("pageProps"); //these is the prop of the page content if component has props.
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
