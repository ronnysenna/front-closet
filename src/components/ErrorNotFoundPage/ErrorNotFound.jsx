import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const ErrorNotFound = ({ cartItems }) => {
  return (
    <main>
      <Header cartItems={cartItems} />
      <section className="main-container-error">
        <h1>Error 404 page not found</h1>
        <a href="/">Voltar a Página inicial</a>
        <img src="/assets/errornotfound.png" alt="" />
      </section>
      <Footer />
    </main>
  );
};

export default ErrorNotFound;
