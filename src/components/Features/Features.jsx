import React from 'react';
import './features.css';

const Features = () => {
    const data = [
        {
          cover: 'fa-solid fa-truck-fast',
          title: "Entrega",
          desc: "Entrega rápida.",
        },
        {
          cover: 'fa-solid fa-id-card',
          title: "pagamento seguro",
          desc: "compre com a segurança.",
        },
        {
          cover: 'fa-solid fa-shield',
          title: "Loja confiavel",
          desc: "compre agora mesmo.",
        },
        {
          cover: 'fa-solid fa-headset',
          title: " Suporte 24/7",
          desc: "Atedimento .",
        },
        {
            cover: 'fa-solid fa-plane',
            title: "venda online",
            desc: "vendemos online.",
          },
          {
            cover: "fa-solid fa-clock",
            title: "entrega",
            desc: "entrega em horarios diversos.",
          },
      ]
  return (
    <>
    <section className="wrapper background">
        <div className="container grid2">
            {data.map((value,index)=>{
                return(
                    <div className="product" key={index}>
                        <div className="img icon-circle" >
                            <i className={value.cover}></i>
                        </div>
                        <h3>{value.title}</h3>
                        <p>{value.desc}</p>
                    </div>
                )
            })}
        </div>
    </section>
    </>
  )
}

export default Features