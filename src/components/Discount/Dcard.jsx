import React from "react";
import discountData from "./discountData.js";
import Slider from "react-slick";


const Dcard = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          dots: true,
        },
      },
    ],
  };
  return (
    <div className="dcard-slider-container">
      <Slider {...settings}>
        {discountData.map((val, index) => {
          return (
            <div className="box product-shop" key={index}>
              <div className="img">
                <img src={val.cover} alt={val.name} />
                <h4>{val.name}</h4>
                <span>{val.price}</span>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Dcard;
