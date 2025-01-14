import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./loginform.css";

const Loginform = () => {
  function handleLogin(event) {
    event.preventDefault();
    return toast.error("Login invalido");
  }

  return (
    <>
      <section className="loginform">
        <div className="container-login">
          <div className="wrapper">
            <div className="heading-login">
              <h1>Entrar</h1>
              <p>
                Novo usuario ?{" "}
                <span>
                  <Link to="/registration">Criar uma conta</Link>
                </span>
              </p>
            </div>
            <form onSubmit={handleLogin} className="form" action="">
              <label className="label">
                Nome
                <input type="text" name="name" />
              </label>
              <label className="label">
                Senha
                <input type="text" name="password" />
              </label>
              <p className="forgot-pass">
                Esqueceu a senha ?{" "}
                <span>
                  <Link to="/forgot-password">Resetar senha</Link>
                </span>
              </p>
              <button className="submit-btn">Entrar</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Loginform;
