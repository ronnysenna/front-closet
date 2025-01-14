import React from "react";
import { useParams } from "react-router-dom";
import "./singleproduct.css";

const Singleproduct = ({ allProductsData, addToCart }) => {
  let id = useParams();
  return (
    <>
      {allProductsData.map((product, index) => {
        if (product.id == id.id) {
          return (
            <div key={index}>
              <section className="single-product">
                <div className="heading-prod">{product.name}</div>
                <div className="single-product-flex">
                  <div className="single-img">
                    <img src={product.img} alt="" />
                    <div className="price">{product.price}.00$</div>
                  </div>
                  <div className="description">
                    {product.desc}
                    <div className="rate-single">
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                    </div>
                    <div>
                      Olhe as novidades {product.discount}% Off Compre agora
                    </div>
                  </div>
                  <button
                    aria-label="Add to cart"
                    className="cart-add-btn"
                    onClick={() => addToCart(product)}
                  >
                    Adcionar ao Carrinho
                  </button>
                </div>
              </section>
            </div>
          );
        }
      })}
    </>
  );
};
export default Singleproduct;
