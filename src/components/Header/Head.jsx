import React from "react";

export const Head = () => {
  return (
    <>
      <section className="head">
        <div className="container d_flex">
          <div className="left-row">
            <a
              target="_blank"
              href="#"
              className="icon-flex phone-icon"
            >
              <i className="fa fa-phone"></i>
              <label className="phone-icon" htmlFor="">
                (85)9 9999-8888
              </label>
            </a>
            <a
              target="_blank"
              href="#"
              className="icon-flex phone-icon"
            >
              <i className="fa fa-envelope"></i>
              <label className="phone-icon" htmlFor="">
                Atedimemto@GoFashion.com
              </label>
            </a>
          </div>
          <div className="right-row">
            <span>
              <label htmlFor="">Rede social</label>
            </span>
            <span>
              <span>Icone </span>
              
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Head;
