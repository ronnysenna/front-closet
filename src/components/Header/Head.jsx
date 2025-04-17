import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

export const Head = () => {
  return (
    <>
      <section className="head">
        <div className="container d_flex">
          <div className="left-row">
            <h1 className="brand-name">GoFashion</h1>
          </div>
          <div className="right-row">
            <span>
              <label htmlFor="">Siga-nos:</label>
            </span>
            <span>
              <a
                target="_blank"
                href="https://www.instagram.com"
                className="icon-flex"
              >
                <i className="fa fa-instagram"></i>
              </a>
            </span>
            <span>
              <a
                target="_blank"
                href="https://wa.me/5585991908723"
                className="icon-flex"
              >
                <i className="fa fa-whatsapp"></i>
              </a>
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Head;
