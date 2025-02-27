import React from "react";

const Categ = () => {
  const data = [
    {
      cateImg: "./assets/brand/brand-1.png",
      cateName: "Exp1",
    },
    {
      cateImg: "./assets/brand/brand-2.png",
      cateName: "Exp2",
    },
    {
      cateImg: "./assets/brand/brand-3.png",
      cateName: "Exp3",
    },
    {
      cateImg: "./assets/brand/brand-2.png",
      cateName: "Exp4",
    },
    {
      cateImg: "./assets/brand/brand-1.png",
      cateName: "Exp5",
    },
    {
      cateImg: "./assets/brand/brand-2.png",
      cateName: "Exp6",
    },
  ];
  return (
    <>
      <div className="category">
        <div className="chead">
          <h1>Moda 1</h1>
          
        </div>
        {data.map((value, index) => {
          return (
            <div
              style={{ display: "flex", borderRadius: "10px" }}
              className="box brand-box"
              key={index}
            >
              <img src={value.cateImg} alt="" />
              <span>{value.cateName}</span>
            </div>
          );
        })}
        <div className="box box2">
          <button>Ver todos</button>
        </div>
      </div>
    </>
  );
};

export default Categ;
