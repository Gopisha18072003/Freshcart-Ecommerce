import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { clearModal, signOut, updateCurrentUser } from "../store/auth-slice";
import { logoutUser, updateUserData } from "../util/http";
import ImageUpload from "../components/ImageUpload";
import { uploadImage } from "../util/http";
import Input from "../components/Input";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Profile() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const { name, email, address, image, pincode } = currentUser;
  const [selectedAction, setSelectedAction] = useState("profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);

  const { mutate } = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      dispatch(signOut());
      setTimeout(() => dispatch(clearModal()), 3000);
      navigate("/");
    },
    onError: (error) => {
      console.error("Logout failed", error);
    },
  });

  function handleChaneAction(action) {
    if (action == "logout") mutate();
    setSelectedAction(action);
  }
  const [isEmailValid, setIsEmailValid] = useState(true);

  function handleEmailChange(event) {
    const email = event.target.value;
    if (email == "") {
      setIsEmailValid(null);
    } else if (email.includes("@") && email.endsWith(".com")) {
      setIsEmailValid(true);
    } else if (
      (email != "" && !email.includes("@")) ||
      !email.endsWith(".com")
    ) {
      setIsEmailValid(false);
    }
  }

  const {
    mutate: mutateUser,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: updateUserData,
    onSuccess: (data) => {
      dispatch(updateCurrentUser(data.user));
      setModal({ type: "success", message: "Updated Successfully" });
      setTimeout(() => setModal(null), 3000);
    },
    onError: () => {
      setModal({ type: "fail", message: "Updation Failed" });
      setTimeout(() => setModal(null), 3000);
    },
  });

  function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data["name"] = `${data["firstName"]} ${data["lastName"]}`;
    mutateUser(JSON.stringify(data));
  }

  return (
    <div className="w-full h-[44rem] bg-gray-100 flex items-center justify-center">
      {modal && (
        <span
          className={`z-50 absolute top-[12rem] left-[38rem] poppins-semibold ${
            modal.type == "success" ? "bg-myGreen-light" : "bg-orange-400"
          } text-white p-4 rounded-md`}
        >
          {modal.message}
        </span>
      )}
      <div className="w-[80%] h-[26rem] bg-white mt-[6rem] mb-2 rounded-3xl flex">
        <aside
          className="border-r-4 border-gray-300 w-[30%]"
          id="navBarProfile"
        >
          <ul className="flex flex-col justify-center h-full  gap-0 poppins-regular tracking-wide">
            <li
              onClick={() => handleChaneAction("profile")}
              className={`flex gap-2 ${
                selectedAction == "profile" ? "active" : ""
              } py-4 pl-8 cursor-pointer`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>

              <span>Edit Profile</span>
            </li>
            <li
              onClick={() => handleChaneAction("orders")}
              className={`flex gap-2 ${
                selectedAction == "orders" ? "active" : ""
              } py-4 pl-8 cursor-pointer`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>

              <span>Orders</span>
            </li>
            <li
              onClick={() => handleChaneAction("wishlist")}
              className={`flex gap-2 ${
                selectedAction == "wishlist" ? "active" : ""
              } py-4 pl-8 cursor-pointer`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>

              <span>Wishlist</span>
            </li>
            <li
              onClick={() => handleChaneAction("notification")}
              className={`flex gap-2 ${
                selectedAction == "notification" ? "active" : ""
              } py-4 pl-8 cursor-pointer`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                />
              </svg>

              <span>Notifications</span>
            </li>
            <li
              onClick={() => handleChaneAction("security")}
              className={`flex gap-2 ${
                selectedAction == "security" ? "active" : ""
              } py-4 pl-8 cursor-pointer`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>

              <span>Security</span>
            </li>
            <li
              onClick={() => handleChaneAction("logout")}
              className={`flex gap-2 ${
                selectedAction == "logout" ? "active" : ""
              } py-4 pl-8 cursor-pointer`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                />
              </svg>

              <span>Logout</span>
            </li>
          </ul>
        </aside>
        <main className="w-[70%] px-12 py-12 overflow-y-scroll">
          <div className="w-[8rem] mx-auto">
            <img
              src={`http://127.0.0.1:8000/${image}`}
              alt="profile photo"
              crossOrigin="anonymous"
              className="w-[8rem] h-[8rem] rounded-full relative object-cover"
            />

            <ImageUpload id="image" onInput={uploadImage} />
          </div>

          <div>
            <form
              action=""
              className="flex flex-col items-start gap-4"
              onSubmit={handleFormSubmit}
            >
              <div className="flex gap-10 justify-center">
                <Input
                  label="First Name"
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={name.split(" ")[0]}
                  required={true}
                />
                <Input
                  label="Last Name"
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={name.split(" ")[1]}
                  required={true}
                />
              </div>
              <Input
                name="email"
                label="Email"
                type="email"
                value={email}
                className={`w-[15rem] ${
                  isEmailValid == true
                    ? "border-myGreen-dark"
                    : "border-red-600"
                } outline-none`}
                id="email"
                onChange={handleEmailChange}
                required={true}
              />
              <Input
                label="Address"
                type="text"
                id="address"
                name="address"
                className="w-[20rem]"
                value={address}
                placeholder="East college para, Raniganj"
              />
              <Input
                label="Pincode"
                type="Number"
                id="pincode"
                name="pincode"
                length="7"
                className="w-24"
                value={pincode}
                placeholder="713347"
              />
              <button
                className="outline-none p-2 bg-orange-500 rounded-md poppins-semibold text-white mx-auto disabled:bg-gray-500 w-[6rem] h-[3rem]"
                disabled={!isEmailValid}
              >
                {isPending ? (
                  <ProgressSpinner className="size-8" strokeWidth="8" />
                ) : (
                  "Update"
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
