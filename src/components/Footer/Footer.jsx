import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="app-store-play">
        <h1>Logo</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque, quia
          eius est sunt consectetur rem possimus officia minima reiciendis
          perspiciatis! Soluta corrupti nesciunt suscipit repellendus adipisci
          reiciendis veritatis, accusantium saepe?
        </p>
        <div className="icon-footer appstore">
          <div className="img d_flex logo-text">
            <i className="fa-brands fa-google-play"></i>
            <span>Google Play Store</span>
          </div>
          <div className="img d_flex logo-text">
            <i className="fa-brands fa-app-store-ios"></i>
            <span>Apple App Store</span>
          </div>
        </div>
      </div>
      <div className="">
        <h2>Sobre</h2>
        <ul>
          <li>Contratos</li>
          <li>Stories</li>
          <li>Terms & Conditions</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
      <div className="">
        <h2>Personalizados</h2>
        <ul>
          <li>Central</li>
          <li>Compre agora</li>
          <li>Sugestões</li>
          <li>Corporação</li>
          <li>Suporte</li>
        </ul>
      </div>
      <div className="">
        <h2>Contato</h2>
        <ul>
          <li>Endereço</li>
          <li className="contact-info-flex">
            Email :
            <a
              target="_blank"
              href="mailto:devfullmarcelo@gmail.com"
              className="icon-flex phone-icon"
            >
              devfullmarcelo@gmail.com
            </a>
          </li>
          <li className="contact-info-flex">
            Phone :{" "}
            <a
              target="_blank"
              href="https://wa.me/5585991908723?text=Ol%C3%A1%2C%20vi%20seu%20site%20e%20tenho%20interesse"
              className="icon-flex phone-icon"
            >
              (85) 9 9190 8723
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
