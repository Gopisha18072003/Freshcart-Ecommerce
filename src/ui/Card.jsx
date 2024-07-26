import { Rating } from "primereact/rating";
import { useSelector, useDispatch } from "react-redux";
import { addItemToCart, removeItemToCart } from "../store/cart-slice";

function handleAddWishlist(event) {
    event.target.setAttribute('fill', '#06D001'); // Change to desired fill color
    event.target.setAttribute('stroke', '#ffffff'); // Change to desired stroke color
    event.target.setAttribute('strokeWidth', 2); 
    event.target.classList.add('bg-[#06D001]');
}


export default function Card({data:product}) {
  const dispatch = useDispatch();
  const cartData = useSelector(state => state.cart.items);
  function handleAddItem(product) {
    dispatch(addItemToCart({product}))
  }
  return (
    <div
      className="border-1 surface-border border-round m-2 text-center py-5 px-3 bg-white rounded-md relative"
      id="card"
    >
      <div className="mb-3 h-[12rem]">
        <img
          src={`./src/assets/items/${product.image}`}
          alt={product.name}
          className="w-full h-full rounded-md"
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
        </h6>
        <div className="flex justify-center gap-2 mb-4">
          <Rating value={product.averageRating} readOnly cancel={false} />
          <span className="poppins-regular text-sm">
            ({product.ratingsQuantity}) ratings
          </span>
        </div>
        <button className="poppins-medium border-[2px] border-orange-400 p-2 rounded-md hover:bg-orange-500 hover:text-white transition-colors" onClick={() => handleAddItem(product)}>
          Add to cart
        </button>
        <div onClick={handleAddWishlist}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#06D001"
            className="size-8 border-2 border-myGreen-dark rounded-full p-1 absolute top-2 right-2 hidden"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
