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
import ChannelVideos from "./components/Channel/ChannelVideos.jsx";
import ChannelTweets from "./components/Channel/ChannelTweets.jsx";
import AboutChannel from "./components/Channel/AboutChannel.jsx";
import ChannelSubscribed from "./components/Channel/ChannelSubscribed.jsx";
import ChannelPlaylist from "./components/Channel/ChannelPlaylist.jsx";
import PlaylistVideos from "./components/Playlist/PlaylistVideos.jsx";
import Tweets from "./pages/Tweets.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PageNotFound from "./components/PageNotFound.jsx";

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
                path: "/tweets",
                element: <Tweets />,
            },
            {
                path: "/channel/:username",
                element: <Channel />,
                children: [
                    {
                        path: "/channel/:username",
                        element: <ChannelVideos />,
                    },
                    {
                        path: "/channel/:username/tweets",
                        element: <ChannelTweets />,
                    },
                    {
                        path: "/channel/:username/playlist",
                        element: <ChannelPlaylist />,
                    },
                    {
                        path: "/channel/:username/subscribed",
                        element: <ChannelSubscribed />,
                    },
                    {
                        path: "/channel/:username/about",
                        element: <AboutChannel />,
                    },
                ],
            },
            {
                path: "/playlist/:playlistId",
                element: <PlaylistVideos />,
            },
            {
                path: "/subscriptions",
                element: <Subscriptions />,
            },
            {
                path: "/admin/dashboard",
                element: <Dashboard />,
            },
        ],
    },
    {
        path: "*",
        element: <PageNotFound />,
    },
]);

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
