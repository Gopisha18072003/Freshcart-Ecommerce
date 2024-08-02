import { Rating } from "primereact/rating";
import { useSelector, useDispatch } from "react-redux";
import { addItemToCart, removeItemToCart } from "../store/cart-slice";
import { useState } from "react";
import { useNavigate } from "react-router";



export default function Card({data:product}) {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items);
  const [tempCart, setTempCart] = useState(cart);
  const navigate = useNavigate()

  function handleAddItem(product) {
    dispatch(addItemToCart({product}))
  }

  function handleClickProduct(id) {
    navigate(`/product/${id}`)
  }

  return (
    <div
      className="border-1 surface-border border-round m-2 text-center py-5 px-3 bg-white rounded-md relative  hover:bg-gray-50"
      id="card" 
    >
      <div className="mb-3 h-[12rem]">
        <img
          src={`/assets/items/${product.image}`}
          alt={product.name}
          className="w-full h-full rounded-md cursor-pointer"
          onClick={() => handleClickProduct(product._id)}
        />
      </div>
      <div>
        <h4 className="mb-2 poppins-bold text-lg">{product.name}</h4>
        <h6 className="mt-0 mb-4">
          {product.discount ? (
            <>
              <s className="text-sm text-gray-500 poppins-regular">
                ${product.price.toFixed(2)}
              </s>{" "}
              <span className="text-md poppins-semibold text-red-500 ">
                $
                {(
                  product.price -
                  (product.price * product.discount) / 100
                ).toFixed(2)}
                
              </span>
              <span className="poppins-semibold text-lg bg-myGreen-dark text-white w-[4rem] h-[4rem] block rounded-full text-center p-2 absolute top-[-0.4rem] left-[-0.5rem]">
                {" "}
                {product.discount}% off
              </span>
            </>
          ) : (
            <span>${product.price.toFixed(2)}</span> 
          )}
          <span className="text-sm poppins-regular text-gray-400 ml-1">{product.parameter}</span>
        </h6>
        <div className="flex justify-center gap-2 mb-4">
          <Rating value={product.averageRating} readOnly cancel={false} />
          <span className="poppins-regular text-sm">
            ({product.ratingsQuantity})
          </span>
        </div>
        <button className="poppins-medium border-[2px] border-orange-400 p-2 rounded-md hover:bg-orange-500 hover:text-white transition-colors" onClick={() => handleAddItem(product)}>
          Add to cart
        </button>
      </div>
    </div>
  );
}
