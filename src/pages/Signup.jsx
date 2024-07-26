import { Link, redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form } from "react-router-dom";
import {
  faEye,
  faEyeSlash,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

import signupImage from "../assets/signUp.jpg";
import { useRef } from "react";
import { useState } from "react";

export default function Signup() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isEmailValid, setIsEmailValid] = useState(null);
  const [isPasswordMatching, setIsPasswordMatching] = useState(null);

  const password = useRef();

  function handleConfirmPasswordChange(event) {
    const confirmPassword = event.target.value;
    if (confirmPassword == "") {
      setIsPasswordMatching(null);
    } else if (confirmPassword == password.current.value) {
      setIsPasswordMatching(true);
    } else if (
      confirmPassword !== "" &&
      confirmPassword !== password.current.value
    ) {
      setIsPasswordMatching(false);
    }
  }

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

  function toggleVisiblePassword() {
    setIsPasswordVisible(!isPasswordVisible);
  }
  function toggleVisibleConfirmPassword() {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  }

  return (
    <>
      <div className="flex max-h-screen m-auto justify-center">
        <main className="lg:w-2/5 mt-16 mb-16 pl-10 pr-10 h-full w-full max-w-[30rem] md:w-auto">
          <div className="mb-1 text-left">
            <h1 className="text-xl p-0 h-auto mb-4 text-left pl-2 poppins-bold">
              Freshcart
            </h1>
            <div className="signup-header mb-10 pl-2">
              <h1 className="poppins-semibold text-3xl md:text-4xl lg:text-5xl">
                Create Account
              </h1>
              <p className="poppins-regular text-gray-400 text-sm">
                Take your first step towards a change
              </p>
            </div>
          </div>

          <Form method="post">
            <div className="signupForm mb-6 max-h-56 overflow-y-scroll text-left scrollable pr-2">
              <div className="mb-6">
                <label
                  htmlFor="firstName"
                  className="poppins-semibold text-gray-700 pl-2"
                >
                  First Name
                </label>
                <div className="flex flex-row border-2 items-center justify-between border-green-400 p-2 rounded-lg">
                  <input
                    type="text"
                    placeholder="John"
                    className="appearance-none focus:outline-none w-4/5 text text-slate-800 poppins-regular"
                    name="firstName"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="lastName"
                  className="poppins-semibold text-gray-700 pl-2"
                >
                  Last Name
                </label>
                <div className="flex flex-row border-2 items-center justify-between border-green-400 p-2 rounded-lg poppins-regular">
                  <input
                    type="text"
                    placeholder="Doe"
                    name="lastName"
                    className="appearance-none focus:outline-none w-4/5 text text-slate-800 bold"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className=" text-gray-700 pl-2 poppins-semibold"
                >
                  Email Address
                </label>
                <div
                  className={`flex flex-row border-2 items-center justify-between ${
                    isEmailValid == false
                      ? "border-red-500"
                      : "border-green-400"
                  } p-2 rounded-lg`}
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="johndoe123@gmail.com"
                    onChange={handleEmailChange}
                    className="appearance-none focus:outline-none w-4/5 text text-slate-800 poppins-regular"
                  />
                  {isEmailValid && (
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-green-400"
                    />
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="poppins-semibold text-gray-700 pl-2 mb-1"
                >
                  Password
                </label>
                <div className="flex border-2 items-center justify-between border-green-400 p-2 rounded-lg poppins-regular">
                  {isPasswordVisible ? (
                    <input
                      type="text"
                      name="password"
                      minLength="8"
                      className="appearance-none focus:outline-none w-4/5 text text-slate-800 "
                      ref={password}
                    />
                  ) : (
                    <input
                      type="password"
                      name="password"
                      minLength="8"
                      ref={password}
                      className="appearance-none focus:outline-none w-4/5 textPassword text-slate-800"
                    />
                  )}
                  <div onClick={toggleVisiblePassword}>
                    {isPasswordVisible ? (
                      <FontAwesomeIcon
                        icon={faEye}
                        className="cursor-pointer"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        className="cursor-pointer "
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="poppins-semibold text-gray-700 pl-2 mb-1"
                >
                  Confirm Password
                </label>
                <div
                  className={`flex border-2 items-center justify-between ${
                    isPasswordMatching === false
                      ? "border-red-500"
                      : "border-green-400"
                  } p-2 rounded-lg poppins-regular`}
                >
                  {isConfirmPasswordVisible ? (
                    <input
                      type="text"
                      name="confirmPassword"
                      minLength="8"
                      onChange={handleConfirmPasswordChange}
                      className="appearance-none focus:outline-none w-4/5 text text-slate-800"
                    />
                  ) : (
                    <input
                      type="password"
                      minLength="8"
                      name="confirmPassword"
                      onChange={handleConfirmPasswordChange}
                      className="appearance-none focus:outline-none w-4/5 textPassword text-slate-800 "
                    />
                  )}
                  <div onClick={toggleVisibleConfirmPassword}>
                    {isConfirmPasswordVisible ? (
                      <FontAwesomeIcon
                        icon={faEye}
                        className="cursor-pointer"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        className="cursor-pointer "
                      />
                    )}
                  </div>
                </div>
                {
                  isPasswordMatching == false && <p className="text-sm text-red-500 text-left poppins-light">Confirm password is not same </p>
                }
              </div>
            </div>
            <button  className="poppins-semibold tracking-wide p-2 bg-myGreen-dark mb-2 hover:bg-green-600 rounded-md text-white disabled:bg-green-600">
              Sign Up
            </button>
          </Form>

          <div>
            <p className="poppins-regular">
              Have an account?{" "}
              <Link
                to="/login"
                className="poppins-semibold smallText hover:text-green-400 cursor-pointer "
              >
                Sign In
              </Link>
            </p>
          </div>
        </main>

        <div className="w-0 md:w-1/2 lg:w-3/5 h:full">
          <img
            src={signupImage}
            alt="fresh vegetables"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </>
  );
}

export async function action({request, params}) {
  const data = await request.formData();
  const password = data.get('password');
  const confirmPassword = data.get('confirmPassword');
  const email = data.get('email');

  if(password !== confirmPassword || !(email.endsWith('.com') && email.includes('@'))) {
    return redirect('/signup');
  }
  const signupData = {
    name: data.get('firstName') + ' ' + data.get('lastName'),
    email: data.get('email'),
    password: data.get('password'),
    confirmPassword: confirmPassword
  }

  return redirect('/');
}
