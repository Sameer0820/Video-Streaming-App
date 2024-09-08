import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import store from "./store/store.js";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/search/:query",
                element: <Search />,
            },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
