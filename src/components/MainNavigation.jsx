import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import AutoCompleteInput from "../ui/AutoCompleteInput";
import { categories } from "../App";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { refreshAccessToken } from "../util/authServices";
//import { logout, updateToken } from "../store/auth-slice";
import {signOut} from '../store/auth-slice'

export default function MainNavigation({ products, classes }) {
  const [selectedCategory, setSelectedCategory] = useState("");

  const cartData = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.currentUser);


  const dispatch = useDispatch();



  useEffect(() => {
    const validateToken = async () => {
    if (user) {
      const response = await refreshAccessToken()
      if(!response) {
        dispatch(signOut)
      }
      console.log('Validating Token')
    }
  }
  validateToken()
  }, [user, dispatch]);

  return (
    <div className={`bg-white pt-4 px-8 ${classes} w-full z-10 pb-2`}>
      <div className="flex justify-between items-center">
        <h1 className="poppins-bold text-2xl">Freshcart</h1>
        <div id="search-bar" className="flex items-center ">
          <Dropdown
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.value)}
            options={categories}
            optionLabel="name"
            placeholder="Select a Category"
            className="w-full md:w-14rem poppins-medium border-slate-600 border-2 px-4 py-2.5 rounded-s-md mySvg"
          />
          <div className="flex">
            <AutoCompleteInput
              products={products}
              category={selectedCategory}
              className="my-custom-autocomplete poppins-medium border-2 border-black"
            />
            <button className="bg-orange-400 px-2.5 py-2.5 flex poppins-medium text-white gap-2 rounded-e-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              Search
            </button>
          </div>
        </div>
        <div id="contact" className="flex gap-2 items-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-12"
            >
              <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <span className="poppins-light text-sm">Get in Touch</span>
            <p className="poppins-medium text-md">+91 7235679901</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className=" bg-myGreen-dark rounded-md flex items-center py-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="size-6 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
            />
          </svg>

          <Dropdown
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.value)}
            options={categories}
            optionLabel="name"
            placeholder="Browse Category"
            className="w-full md:w-14rem poppins-medium pr-4 pl-2 py-2.5  mySvg text-white"
          />
        </div>
        <nav>
          <ul className="poppins-light flex gap-4">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "font-bold" : undefined)}
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) => (isActive ? "font-bold" : undefined)}
            >
              Shop
            </NavLink>
            <NavLink
              to="/support"
              className={({ isActive }) => (isActive ? "font-bold" : undefined)}
            >
              Support
            </NavLink>
          </ul>
        </nav>

        <div className="flex items-center gap-4 relative">
          {cartData.length > 0 && (
            <div className="w-5 h-5 rounded-full text-white bg-orange-600 text-center flex justify-center items-center absolute top-0 left-[-4px]">
              <span className="block">{cartData.length}</span>
            </div>
          )}
          {user && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#06D001"
              className="size-11 border-2 border-myGreen-dark rounded-md p-1.5 bg-lime-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          )}
          {!user && (
            <Link
              className="poppins-medium bg-black text-white px-4 py-4 rounded-md"
              to="/login"
            >
              Login/Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
