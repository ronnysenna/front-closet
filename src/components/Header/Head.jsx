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
          <div className="social-icons-right">
            
          <a
            href="https://www.instagram.com/gofashion_brasil"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon instagram-icon"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a
            href="https://wa.me/5585982064398"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon whatsapp-icon"
          >
            <i className="fa-brands fa-whatsapp"></i>
          </a>
        </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Head;
