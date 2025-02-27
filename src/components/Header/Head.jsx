import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

export const Head = () => {
  return (
    <>
      <section className="head">
        <div className="container d_flex">
          <div className="left-row">
            <a
              target="_blank"
              href="https://wa.me/5585991908723?text=Ol%C3%A1%2C%20vi%20seu%20site%20e%20tenho%20interesse"
              className="icon-flex phone-icon"
            >
              <i className="fa fa-phone"></i>
              <label className="phone-icon" htmlFor="">
                (85) 99190-8723
              </label>
            </a>
            <a
              target="_blank"
              href="mailto:devfullmarcelo@gmail.com"
              className="icon-flex phone-icon"
            >
              <i className="fa fa-envelope"></i>
              <label className="phone-icon" htmlFor="">
                devfullmarcelo@gmail.com
              </label>
            </a>
          </div>
          <div className="right-row">
            <span>
              <label htmlFor="">Rede social</label>
            </span>
            <span>
              <a href="#">
                <i className="fa fa-instagram"></i>
              </a>
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Head;
