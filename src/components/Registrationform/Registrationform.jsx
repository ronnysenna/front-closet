import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Registrationform = () => {
  function handleRegister(event) {
    event.preventDefault();
    return toast.error("Register functionality is not live yet");
  }

  return (
    <section className="loginform">
      <div className="container-login">
        <div className="wrapper">
          <div className="heading-login">
            <h1>Entrar</h1>
            <p>
              esqueceu seu acesso ?{" "}
              <span>
                <Link to="/login">Login</Link>
              </span>
            </p>
          </div>
          <form onSubmit={handleRegister} className="form" action="">
            <label className="label name">
              Nome
              <input type="text" name="name" />
            </label>
            <label className="label">
              Usuario
              <input type="text" name="name" />
            </label>
            <label className="label">
              Senha
              <input type="text" name="password" />
            </label>
            <p className="forgot-pass">
              Termos de privacidade{" "}
              <span>
                <Link to="/termsNconditions">terms & conditions</Link>
              </span>
            </p>
            <button className="submit-btn">Entrar</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Registrationform;
