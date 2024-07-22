import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import { QueryClientProvider } from "@tanstack/react-query";
import { querClient } from "./util/http";
import ProtectedRoute from "./util/authentication.jsx";
import { loader as rootLoader } from "./pages/Root";

import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import ShopPage from "./pages/Shop";

import { Provider } from "react-redux";
import store from "./store/store.js";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";

import { action as signupAction } from "./pages/Signup.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      loader: rootLoader,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "/shop", element: <ShopPage /> },
        {
          path: "/cart",
          element: (
            <ProtectedRoute>
              <></>
            </ProtectedRoute>
          ),
        },
        {
          path: "/me",
          element: (
            <ProtectedRoute>
              <></>
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <Signin />,
    },
    {
      path: "/signup",
      element: <Signup />,
      action: signupAction,
    },
  ]);
  return (
    <Provider store={store}>
      <PrimeReactProvider>
        <QueryClientProvider client={querClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
      </PrimeReactProvider>
    </Provider>
  );
}

export default App;
export const categories = [
  { name: "Fruits", value: "fruits", icon: "/icons/fruit.png" },
  { name: "Vegetables", value: "vegetables", icon: "/icons/vegetable.png" },
  { name: "Meats", value: "meats", icon: "/icons/barbecue.png" },
  { name: "Seafoods", value: "packed seafoods", icon: "/icons/seafood.png" },
  { name: "Dairy", value: "dairy", icon: "/icons/dairy.png" },
  { name: "Groceies", value: "grocery", icon: "/icons/grocery.png" },
  { name: "Poultry", value: "poultry", icon: "/icons/poultry.png" },
  { name: "Frozen", value: "frozen foods", icon: "/icons/frozen.png" },
];
