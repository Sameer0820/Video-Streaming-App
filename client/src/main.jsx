import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import store from "./store/store.js";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Video from "./pages/Video.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import LikedVideos from "./pages/LikedVideos.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";
import Support from "./pages/Support.jsx";
import Channel from "./pages/Channel.jsx";

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
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <SignUp />,
            },
            {
                path: "/search/:query",
                element: <Search />,
            },
            {
                path: "/watchpage/:videoId",
                element: <Video />,
            },
            {
                path: "/liked-videos",
                element: <LikedVideos />,
            },
            {
                path: "/history",
                element: <History />,
            },
            {
                path: "/settings",
                element: <Settings />,
            },
            {
                path: "/support",
                element: <Support />,
            },
            {
                path: "/channel/:username",
                element: <Channel />,
                children: [
                    {
                        path: "/channel/:username/tweets",
                    },
                    {
                        path: "/channel/:username/playlist",
                    },
                    {
                        path: "/channel/:username/subscribers",
                    },
                    {
                        path: "/channel/:username/about",
                    },
                ],
            },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
