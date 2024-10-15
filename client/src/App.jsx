import Navbar from "./components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { useDispatch} from "react-redux";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { healthCheck } from "./hooks/healthCheck";
import { getCurrentUser } from "./hooks/getCurrentUser";
import { icons } from "./assets/Icons.jsx";

function App() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        healthCheck().then(() => {
            getCurrentUser(dispatch).then(() => {
                setLoading(false);
            });
        });
        setInterval(() => {
            healthCheck();
        }, 5 * 60 * 1000);
    }, []);

    if (loading) {
        return (
            <div className="h-screen w-full  overflow-y-auto bg-[#121212] text-white">
                <div className="flex flex-col items-center justify-center mt-64">
                    <span>{icons.loading}</span>
                    <h1 className="text-3xl text-center mt-8 font-semibold">
                        Please wait...
                    </h1>
                    <h1 className="text-xl text-center mt-4">
                        Refresh the page if it takes too long
                    </h1>
                </div>
            </div>
        );
    }
    return (
        <div className="h-screen w-screen bg-black text-white flex flex-col bg-opacity-95">
            <Navbar />
            <div className="w-full h-full flex overflow-auto">
                <div>
                    <Sidebar />
                </div>
                <main className="overflow-y-auto h-full w-full scrollbar-hide" id="scrollableDiv">
                    <Outlet />
                </main>
            </div>
            <div id="popup-models" className="bg-pink-400 relative"></div>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </div>
    );
}

export default App;
